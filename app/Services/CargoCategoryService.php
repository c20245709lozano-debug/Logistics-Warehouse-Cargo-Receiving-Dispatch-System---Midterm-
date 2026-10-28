<?php

namespace App\Services;

use App\Models\CargoCategory;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class CargoCategoryService
{
    public function getPaginatedCategories(): LengthAwarePaginator
    {
        return CargoCategory::query()
            ->orderBy('category_name')
            ->paginate(10);
    }

    public function getCategoryWithShipmentCount(
        CargoCategory $cargoCategory
    ): CargoCategory {
        return $cargoCategory->loadCount('shipments');
    }

    public function create(array $data): CargoCategory
    {
        return CargoCategory::create($data);
    }

    public function update(
        CargoCategory $cargoCategory,
        array $data
    ): CargoCategory {
        $cargoCategory->update($data);

        return $cargoCategory->refresh();
    }

    public function delete(CargoCategory $cargoCategory): bool
    {
        if ($cargoCategory->shipments()->exists()) {
            return false;
        }

        return (bool) $cargoCategory->delete();
    }
}
