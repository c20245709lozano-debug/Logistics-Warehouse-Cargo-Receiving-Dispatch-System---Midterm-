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
        return WarehouseBay::withCount([
            'shipments as occupied_shipments_count' => function ($query) {
                $query->where(function ($activeQuery) {
                    $activeQuery->whereNull('dispatch_date')
                        ->orWhereDate('dispatch_date', '>', today());
                });
            },
        ])
            ->orderBy('bay_code')
            ->paginate(10);
    }

    public function getBayWithShipments(WarehouseBay $bay): WarehouseBay
    {
        return $bay->load([
            'shipments.sender',
            'shipments.receiver',
            'shipments.cargoCategory',
        ]);
    }

    public function create(array $data): WarehouseBay
    {
        return WarehouseBay::create($this->sanitizeData($data));
    }

    public function update(
        WarehouseBay $bay,
        array $data
    ): WarehouseBay {
        $data = $this->sanitizeData($data);

        return DB::transaction(function () use ($bay, $data) {
            $bay = WarehouseBay::whereKey($bay->id)
                ->lockForUpdate()
                ->firstOrFail();

            $activeShipments = $bay->shipments()
                ->where(function ($query) {
                    $query->whereNull('dispatch_date')
                        ->orWhereDate('dispatch_date', '>', today());
                })
                ->get();

            $currentWeight = (float) $activeShipments->sum('weight_kg');
            $currentVolume = (float) $activeShipments->sum('volume_cbm');

            $newMaxWeight = array_key_exists('max_weight_kg', $data)
                ? (float) $data['max_weight_kg']
                : (float) $bay->max_weight_kg;

            $newMaxVolume = array_key_exists('max_volume_cbm', $data)
                ? (float) $data['max_volume_cbm']
                : (float) $bay->max_volume_cbm;

            if ($currentWeight > $newMaxWeight ||
                $currentVolume > $newMaxVolume) {
                throw ValidationException::withMessages([
                    'capacity' => 'The new bay capacity cannot be lower than its currently assigned cargo.',
                ]);
            }

            $bay->update($data);

            return $bay->refresh();
        });
    }

    public function delete(WarehouseBay $bay): bool
    {
        return DB::transaction(function () use ($bay) {
            $bay = WarehouseBay::whereKey($bay->id)
                ->lockForUpdate()
                ->firstOrFail();

            if ($bay->shipments()->exists()) {
                return false;
            }

            return $bay->delete();
        });
    }

    private function sanitizeData(array $data): array
    {
        if (array_key_exists('bay_code', $data)) {
            $code = strip_tags((string) $data['bay_code']);
            $code = preg_replace('/\s+/u', ' ', $code) ?? $code;

            // Exam requirement: bay codes must be uppercase.
            $data['bay_code'] = strtoupper(trim($code));

            if ($data['bay_code'] === '') {
                throw ValidationException::withMessages([
                    'bay_code' => 'The bay code is required.',
                ]);
            }
        }

        foreach (['max_weight_kg', 'max_volume_cbm'] as $field) {
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
}