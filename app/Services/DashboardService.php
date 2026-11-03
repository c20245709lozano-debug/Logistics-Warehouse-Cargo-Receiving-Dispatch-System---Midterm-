<?php

namespace App\Services;

use App\Models\BillingStatement;
use App\Models\CargoCategory;
use App\Models\Company;
use App\Models\Shipment;
use App\Models\WarehouseBay;

class DashboardService
{
    public function getSummary(): array
    {
        return [
            'totalShipments' => Shipment::count(),
            'currentlyStored' => Shipment::whereNull('dispatch_date')->count(),
            'dispatchedShipments' => Shipment::whereNotNull('dispatch_date')->count(),
            'totalCompanies' => Company::count(),
            'totalCargoCategories' => CargoCategory::count(),
            'totalWarehouseBays' => WarehouseBay::count(),
            'totalBilling' => BillingStatement::sum('total_cost'),
        ];
    }
}
