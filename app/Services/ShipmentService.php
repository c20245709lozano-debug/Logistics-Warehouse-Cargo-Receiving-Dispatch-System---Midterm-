<?php

namespace App\Services;

use App\Models\BillingStatement;
use App\Models\Shipment;
use App\Models\WarehouseBay;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class ShipmentService
{
    /**
     * Create a shipment and its billing statement.
     */
    public function create(array $data): Shipment
    {
        return $this->saveShipment($data);
    }

    /**
     * Update a shipment and its billing statement.
     */
    public function update(Shipment $shipment, array $data): Shipment
    {
        return $this->saveShipment($data, $shipment);
    }

    /**
     * Save the shipment, check bay capacity,
     * and calculate storage fees.
     */
    private function saveShipment(
        array $data,
        ?Shipment $shipment = null
    ): Shipment {
        return DB::transaction(function () use ($data, $shipment) {

            // Preserve the existing shipping fee during updates
            // when the request does not provide a new one.
            $shippingFee = array_key_exists('shipping_fee', $data)
                ? (float) $data['shipping_fee']
                : (float) (
                    $shipment?->billingStatement?->shipping_fee ?? 0
                );

            // Shipping fee is stored in the billing statement,
            // not in the shipments table.
            unset($data['shipping_fee']);

            // Lock the selected warehouse bay while checking capacity.
            $bay = WarehouseBay::query()
                ->whereKey($data['warehouse_bay_id'])
                ->lockForUpdate()
                ->firstOrFail();

            // Count shipments still occupying the bay:
            // 1. Shipments without a dispatch date.
            // 2. Shipments scheduled for a future dispatch date.
            $occupiedShipments = Shipment::query()
                ->where('warehouse_bay_id', $bay->id)
                ->where(function ($query) {
                    $query->whereNull('dispatch_date')
                        ->orWhereDate(
                            'dispatch_date',
                            '>',
                            today()
                        );
                })
                // Do not count the shipment being updated twice.
                ->when(
                    $shipment,
                    fn ($query) => $query->where(
                        'id',
                        '!=',
                        $shipment->id
                    )
                );

            $currentWeight = (float) (clone $occupiedShipments)
                ->sum('weight_kg');

            $currentVolume = (float) (clone $occupiedShipments)
                ->sum('volume_cbm');

            $newWeight = (float) $data['weight_kg'];
            $newVolume = (float) $data['volume_cbm'];

            // Determine whether this shipment will occupy the bay.
            $dispatchDate = $data['dispatch_date'] ?? null;

            $willOccupyBay = $dispatchDate === null
                || Carbon::parse($dispatchDate)
                    ->startOfDay()
                    ->gt(today());

            // Reject shipments that exceed the maximum weight.
          // Check capacity only if the shipment will occupy the bay.
if ($willOccupyBay) {
    if (
        $currentWeight + $newWeight
        > (float) $bay->max_weight_kg
    ) {
        throw ValidationException::withMessages([
            'weight_kg' =>
                'This shipment exceeds the warehouse bay weight capacity.',
        ]);
    }

    if (
        $currentVolume + $newVolume
        > (float) $bay->max_volume_cbm
    ) {
        throw ValidationException::withMessages([
            'volume_cbm' =>
                'This shipment exceeds the warehouse bay volume capacity.',
        ]);
    }
}

            // Create or update the shipment.
            if ($shipment) {
                $shipment->update($data);
            } else {
                $shipment = Shipment::create($data);
            }

            // Calculate storage duration, including arrival and
            // dispatch dates. Active shipments accrue through today.
            $arrivalDate = $shipment->arrival_date
                ->copy()
                ->startOfDay();

            $endDate = $shipment->dispatch_date
                ? $shipment->dispatch_date->copy()->startOfDay()
                : now()->startOfDay();

            // Avoid a negative storage duration for future arrivals.
            if ($endDate->lt($arrivalDate)) {
                $endDate = $arrivalDate->copy();
            }

            $storageDays = $arrivalDate->diffInDays($endDate) + 1;

            // Get the daily storage rate for this cargo category.
            $storageRate = (float) $shipment
                ->cargoCategory()
                ->value('daily_storage_rate');

            $storageFee = $storageRate * $storageDays;

            // Create or update the billing statement.
            BillingStatement::updateOrCreate(
                ['shipment_id' => $shipment->id],
                [
                    'storage_fee' => $storageFee,
                    'shipping_fee' => $shippingFee,
                    'total_cost' => $storageFee + $shippingFee,
                ]
            );

            // Return the shipment with its related records loaded.
            return $shipment->load([
                'sender',
                'receiver',
                'cargoCategory',
                'warehouseBay',
                'billingStatement',
            ]);
        });
    }
}
