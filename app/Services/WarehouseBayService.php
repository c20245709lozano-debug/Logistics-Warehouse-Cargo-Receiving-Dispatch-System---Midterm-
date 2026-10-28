<?php

namespace App\Services;

use App\Models\WarehouseBay;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class WarehouseBayService
{
    public function getPaginatedBays(): LengthAwarePaginator
    {
        return WarehouseBay::query()
            ->withCount([
                'shipments as occupied_shipments_count' => function ($query) {
                    $query->where(function ($query) {
                        $query->whereNull('dispatch_date')
                            ->orWhereDate('dispatch_date', '>', today());
                    });
                },
            ])
            ->orderBy('bay_code')
            ->paginate(10);
    }

    public function getBayWithShipments(
        WarehouseBay $warehouseBay
    ): WarehouseBay {
        return $warehouseBay->load([
            'shipments.sender',
            'shipments.receiver',
            'shipments.cargoCategory',
        ]);
    }

    public function create(array $data): WarehouseBay
    {
        return WarehouseBay::create($data);
    }

    public function update(
        WarehouseBay $warehouseBay,
        array $data
    ): WarehouseBay {
        return DB::transaction(function () use ($warehouseBay, $data) {
            $bay = WarehouseBay::query()
                ->whereKey($warehouseBay->id)
                ->lockForUpdate()
                ->firstOrFail();

            $activeShipments = $bay->shipments()
                ->where(function ($query) {
                    $query->whereNull('dispatch_date')
                        ->orWhereDate('dispatch_date', '>', today());
                });

            $currentWeight = (float) (clone $activeShipments)
                ->sum('weight_kg');

            $currentVolume = (float) (clone $activeShipments)
                ->sum('volume_cbm');

            if ((float) $data['max_weight_kg'] < $currentWeight) {
                throw ValidationException::withMessages([
                    'max_weight_kg' =>
                        'The new maximum weight cannot be lower than the total weight of cargo currently stored in this bay.',
                ]);
            }

            if ((float) $data['max_volume_cbm'] < $currentVolume) {
                throw ValidationException::withMessages([
                    'max_volume_cbm' =>
                        'The new maximum volume cannot be lower than the total volume of cargo currently stored in this bay.',
                ]);
            }

            $bay->update($data);

            return $bay->refresh();
        });
    }

    public function delete(WarehouseBay $warehouseBay): bool
    {
        return DB::transaction(function () use ($warehouseBay) {
            $bay = WarehouseBay::query()
                ->whereKey($warehouseBay->id)
                ->lockForUpdate()
                ->firstOrFail();

            if ($bay->shipments()->exists()) {
                return false;
            }

            $bay->delete();

            return true;
        });
    }
}
