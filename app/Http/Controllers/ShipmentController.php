<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreShipmentRequest;
use App\Http\Requests\UpdateShipmentRequest;
use App\Models\BillingStatement;
use App\Models\CargoCategory;
use App\Models\Company;
use App\Models\Shipment;
use App\Models\WarehouseBay;
use App\Services\ShipmentService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ShipmentController extends Controller
{
    public function index(Request $request): Response
    {
        $search = trim((string) $request->query('search', ''));
        $status = (string) $request->query('status', 'all');
        $arrivalDate = (string) $request->query('arrival_date', '');

        // Accept only supported status values.
        if (! in_array($status, ['all', 'stored', 'dispatched'], true)) {
            $status = 'all';
        }

        // Ignore invalid arrival-date filters.
   // Ignore invalid arrival-date formats.
// Ignore invalid arrival-date formats.
if (
    $arrivalDate !== ''
    && ! preg_match('/^\d{4}-\d{2}-\d{2}$/', $arrivalDate)
) {
    $arrivalDate = '';
}

        $query = Shipment::query()->with([
            'sender',
            'receiver',
            'cargoCategory',
            'warehouseBay',
            'billingStatement',
        ]);

        // Search by sender, receiver, or cargo category.
        if ($search !== '') {
            $query->where(function ($shipmentQuery) use ($search) {
                if (ctype_digit($search)) {
                    $shipmentQuery->orWhere('id', (int) $search);
                }

                $shipmentQuery
                    ->orWhereHas('sender', function ($companyQuery) use ($search) {
                        $companyQuery->where(
                            'company_name',
                            'like',
                            "%{$search}%"
                        );
                    })
                    ->orWhereHas('receiver', function ($companyQuery) use ($search) {
                        $companyQuery->where(
                            'company_name',
                            'like',
                            "%{$search}%"
                        );
                    })
                    ->orWhereHas('cargoCategory', function ($categoryQuery) use ($search) {
                        $categoryQuery->where(
                            'category_name',
                            'like',
                            "%{$search}%"
                        );
                    });
            });
        }

        // Filter by dispatch status.
        if ($status === 'stored') {
            $query->whereNull('dispatch_date');
        } elseif ($status === 'dispatched') {
            $query->whereNotNull('dispatch_date');
        }

        // Filter by arrival date.
        if ($arrivalDate !== '') {
            $query->whereDate('arrival_date', $arrivalDate);
        }

        $shipments = $query
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('shipments/index', [
            'shipments' => $shipments,
            'filters' => [
                'search' => $search,
                'status' => $status,
                'arrival_date' => $arrivalDate,
            ],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('shipments/create', [
            'companies' => Company::orderBy('company_name')->get(),
            'categories' => CargoCategory::orderBy('category_name')->get(),
            'bays' => WarehouseBay::orderBy('bay_code')->get(),
        ]);
    }

    public function store(
        StoreShipmentRequest $request,
        ShipmentService $shipmentService
    ): RedirectResponse {
        $shipmentService->create($request->validated());

        return to_route('shipments.index')
            ->with('success', 'Shipment created successfully.');
    }

    public function show(Shipment $shipment): Response
    {
        $shipment->load([
            'sender',
            'receiver',
            'cargoCategory',
            'warehouseBay',
            'billingStatement',
        ]);

        return Inertia::render('shipments/show', [
            'shipment' => $shipment,
        ]);
    }

    public function edit(Shipment $shipment): Response
    {
        $shipment->load('billingStatement');

        return Inertia::render('shipments/edit', [
            'shipment' => $shipment,
            'companies' => Company::orderBy('company_name')->get(),
            'categories' => CargoCategory::orderBy('category_name')->get(),
            'bays' => WarehouseBay::orderBy('bay_code')->get(),
        ]);
    }

    public function update(
        UpdateShipmentRequest $request,
        Shipment $shipment,
        ShipmentService $shipmentService
    ): RedirectResponse {
        $shipmentService->update($shipment, $request->validated());

        return to_route('shipments.index')
            ->with('success', 'Shipment updated successfully.');
    }

    public function destroy(Shipment $shipment): RedirectResponse
    {
        $shipment->delete();

        return to_route('shipments.index')
            ->with('success', 'Shipment deleted successfully.');
    }
}
