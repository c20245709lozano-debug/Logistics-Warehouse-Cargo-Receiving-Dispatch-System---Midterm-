<?php

namespace App\Services;

use App\Models\BillingStatement;
use App\Models\Shipment;
use App\Models\WarehouseBay;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Carbon\Carbon;



class ShipmentService
{
    public function create(array $data): Shipment
    {
        return $this->saveShipment(new Shipment(), $data);
    }

    public function update(Shipment $shipment, array $data): Shipment
    {
        return $this->saveShipment($shipment, $data);
    }

    public function delete(Shipment $shipment): bool
    {
        return DB::transaction(function () use ($shipment) {
            $shipment = Shipment::whereKey($shipment->id)
                ->lockForUpdate()
                ->firstOrFail();

            $shipment->billingStatement()->delete();

            return $shipment->delete();
        });
    }

    private function saveShipment(
        Shipment $shipment,
        array $data
    ): Shipment {
        $data = $this->sanitizeData($data);

        return DB::transaction(function () use ($shipment, $data) {
            $shippingFee = array_key_exists('shipping_fee', $data)
                ? (float) $data['shipping_fee']
                : (float) ($shipment->billingStatement?->shipping_fee ?? 0);

            unset($data['shipping_fee']);

            $bayId = $data['warehouse_bay_id']
                ?? $shipment->warehouse_bay_id;

            $bay = WarehouseBay::whereKey($bayId)
                ->lockForUpdate()
                ->firstOrFail();

            $activeShipments = Shipment::where('warehouse_bay_id', $bay->id)
                ->where(function ($query) {
                    $query->whereNull('dispatch_date')
                        ->orWhereDate('dispatch_date', '>', today());
                })
                ->when($shipment->exists, function ($query) use ($shipment) {
                    $query->where('id', '!=', $shipment->id);
                })
                ->get();

            $currentWeight = (float) $activeShipments->sum('weight_kg');
            $currentVolume = (float) $activeShipments->sum('volume_cbm');

            $arrivalDate = Carbon::parse(
                $data['arrival_date'] ?? $shipment->arrival_date
            );

            $dispatchDateValue = $data['dispatch_date']
                ?? $shipment->dispatch_date;

            $dispatchDate = $dispatchDateValue
                ? Carbon::parse($dispatchDateValue)
                : null;

            $willOccupyBay = $dispatchDate === null ||
                $dispatchDate->isAfter(today());

            $newWeight = (float) (
                $data['weight_kg'] ?? $shipment->weight_kg ?? 0
            );

            $newVolume = (float) (
                $data['volume_cbm'] ?? $shipment->volume_cbm ?? 0
            );

            if ($willOccupyBay) {
                if (($currentWeight + $newWeight) > (float) $bay->max_weight_kg) {
                    throw ValidationException::withMessages([
                        'weight_kg' => 'The selected warehouse bay does not have enough weight capacity.',
                    ]);
                }

                if (($currentVolume + $newVolume) > (float) $bay->max_volume_cbm) {
                    throw ValidationException::withMessages([
                        'volume_cbm' => 'The selected warehouse bay does not have enough volume capacity.',
                    ]);
                }
            }

            $shipment->fill($data);
            $shipment->save();

            $storageEndDate = $dispatchDate ?? Carbon::today();

            // Do not calculate negative storage duration for future arrivals.
            $storageDays = $arrivalDate->greaterThan($storageEndDate)
                ? 0
                : $arrivalDate->diffInDays($storageEndDate) + 1;

            $dailyRate = (float) $shipment->cargoCategory()
                ->value('daily_storage_rate');

            $storageFee = round($storageDays * $dailyRate, 2);
            $totalCost = round($storageFee + $shippingFee, 2);

            BillingStatement::updateOrCreate(
                ['shipment_id' => $shipment->id],
                [
                    'storage_fee' => number_format($storageFee, 2, '.', ''),
                    'shipping_fee' => number_format($shippingFee, 2, '.', ''),
                    'total_cost' => number_format($totalCost, 2, '.', ''),
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

    private function sanitizeData(array $data): array
    {
        foreach ([
            'sender_company_id',
            'receiver_company_id',
            'cargo_category_id',
            'warehouse_bay_id',
        ] as $field) {
            if (array_key_exists($field, $data) && is_numeric($data[$field])) {
                $data[$field] = (int) $data[$field];
            }
        }

        foreach (['weight_kg', 'volume_cbm', 'shipping_fee'] as $field) {
            if (array_key_exists($field, $data)) {
                if (! is_numeric($data[$field])) {
                    throw ValidationException::withMessages([
                        $field => 'This value must be numeric.',
                    ]);
                }

                $data[$field] = number_format(
                    (float) $data[$field],
                    2,
                    '.',
                    ''
                );
            }
        }

        return $data;
    }
    public function getPaginatedShipments(array $filters = [])
{
    $query = Shipment::query()->with([
        'sender',
        'receiver',
        'cargoCategory',
        'warehouseBay',
        'billingStatement',
    ]);

    if (! empty($filters['search'])) {
        $search = $filters['search'];

        $query->where(function ($q) use ($search) {
            if (ctype_digit($search)) {
                $q->orWhere('id', (int) $search);
            }

            $q->orWhereHas('sender', fn ($c) =>
                $c->where('company_name', 'like', "%{$search}%")
            )->orWhereHas('receiver', fn ($c) =>
                $c->where('company_name', 'like', "%{$search}%")
            )->orWhereHas('cargoCategory', fn ($c) =>
                $c->where('category_name', 'like', "%{$search}%")
            );
        });
    }

    if (($filters['status'] ?? 'all') === 'stored') {
        $query->whereNull('dispatch_date');
    } elseif (($filters['status'] ?? 'all') === 'dispatched') {
        $query->whereNotNull('dispatch_date');
    }

    if (! empty($filters['arrival_date'])) {
        $query->whereDate('arrival_date', $filters['arrival_date']);
    }

    return $query->latest()->paginate(10)->withQueryString();
}

public function getFormDependencies(): array
{
    return [
        'companies' => \App\Models\Company::orderBy('company_name')->get(),
        'categories' => \App\Models\CargoCategory::orderBy('category_name')->get(),
        'bays' => \App\Models\WarehouseBay::orderBy('bay_code')->get(),
    ];
}

public function getShipmentWithRelations(Shipment $shipment): Shipment
{
    return $shipment->load([
        'sender',
        'receiver',
        'cargoCategory',
        'warehouseBay',
        'billingStatement',
    ]);
}
}