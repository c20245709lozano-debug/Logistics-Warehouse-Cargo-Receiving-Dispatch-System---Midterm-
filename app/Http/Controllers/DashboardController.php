<?php

namespace App\Http\Controllers;

use App\Models\BillingStatement;
use App\Models\CargoCategory;
use App\Models\Company;
use App\Models\Shipment;
use App\Models\WarehouseBay;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('dashboard', [
            'totalShipments' => Shipment::count(),

            'currentlyStored' => Shipment::whereNull('dispatch_date')
                ->count(),

            'dispatchedShipments' => Shipment::whereNotNull('dispatch_date')
                ->count(),

            'totalCompanies' => Company::count(),

            'totalCargoCategories' => CargoCategory::count(),

            'totalWarehouseBays' => WarehouseBay::count(),

            'totalBilling' => BillingStatement::sum('total_cost'),
        ]);
    }
}
