<?php

namespace App\Services;

use App\Models\CargoCategory;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Validation\ValidationException;

class CargoCategoryService
{
    public function getPaginatedCategories(): LengthAwarePaginator
    {
        return CargoCategory::withCount('shipments')
            ->orderBy('category_name')
            ->paginate(10);
    }

    public function getCategoryWithShipmentCount(
        CargoCategory $category
    ): CargoCategory {
        return $category->loadCount('shipments');
    }

    public function create(array $data): CargoCategory
    {
        return CargoCategory::create($this->sanitizeData($data));
    }

    public function update(
        CargoCategory $category,
        array $data
    ): CargoCategory {
        $category->update($this->sanitizeData($data));

        return $category->refresh();
    }

    public function delete(CargoCategory $category): bool
    {
        if ($category->shipments()->exists()) {
            return false;
        }

        return $category->delete();
    }

    private function sanitizeData(array $data): array
    {
        if (array_key_exists('category_name', $data)) {
            $name = strip_tags((string) $data['category_name']);
            $name = preg_replace('/\s+/u', ' ', $name) ?? $name;
            $data['category_name'] = trim($name);

            if ($data['category_name'] === '') {
                throw ValidationException::withMessages([
                    'category_name' => 'The category name is required.',
                ]);
            }
        }

        if (array_key_exists('daily_storage_rate', $data)) {
            if (! is_numeric($data['daily_storage_rate'])) {
                throw ValidationException::withMessages([
                    'daily_storage_rate' => 'The storage rate must be numeric.',
                ]);
            }

            $data['daily_storage_rate'] = number_format(
                (float) $data['daily_storage_rate'],
                2,
                '.',
                ''
            );
        }

        return $data;
    }
}