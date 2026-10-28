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
     * Delete a shipment and its associated billing statement.
     */
    public function delete(Shipment $shipment): void
    {
        DB::transaction(function () use ($shipment) {
            $shipment = Shipment::query()
                ->whereKey($shipment->id)
                ->lockForUpdate()
                ->firstOrFail();

            $shipment->billingStatement()->delete();
            $shipment->delete();
        });
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
            $shippingFee = array_key_exists('shipping_fee', $data)
                ? (float) $data['shipping_fee']
                : (float) (
                    $shipment?->billingStatement?->shipping_fee ?? 0
                );

            unset($data['shipping_fee']);

            $bay = WarehouseBay::query()
                ->whereKey($data['warehouse_bay_id'])
                ->lockForUpdate()
                ->firstOrFail();

            $occupiedShipments = Shipment::query()
                ->where('warehouse_bay_id', $bay->id)
                ->where(function ($query) {
                    $query->whereNull('dispatch_date')
                        ->orWhereDate('dispatch_date', '>', today());
                })
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
            $dispatchDate = $data['dispatch_date'] ?? null;

            $willOccupyBay = $dispatchDate === null
                || Carbon::parse($dispatchDate)
                    ->startOfDay()
                    ->gt(today());

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

            if ($shipment) {
                $shipment->update($data);
            } else {
                $shipment = Shipment::create($data);
            }

            $arrivalDate = $shipment->arrival_date
                ->copy()
                ->startOfDay();

            $endDate = $shipment->dispatch_date
                ? $shipment->dispatch_date->copy()->startOfDay()
                : now()->startOfDay();

            if ($endDate->lt($arrivalDate)) {
                $endDate = $arrivalDate->copy();
            }

            $storageDays = $arrivalDate->diffInDays($endDate) + 1;

            $storageRate = (float) $shipment
                ->cargoCategory()
                ->value('daily_storage_rate');

            $storageFee = $storageRate * $storageDays;

            BillingStatement::updateOrCreate(
                ['shipment_id' => $shipment->id],
                [
                    'storage_fee' => $storageFee,
                    'shipping_fee' => $shippingFee,
                    'total_cost' => $storageFee + $shippingFee,
                ]
            );

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
