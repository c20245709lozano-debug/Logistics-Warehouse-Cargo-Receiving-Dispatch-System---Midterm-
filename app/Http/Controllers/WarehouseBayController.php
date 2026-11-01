<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreShipmentRequest;
use App\Http\Requests\UpdateShipmentRequest;
use App\Models\Shipment;
use App\Services\ShipmentService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ShipmentController extends Controller
{
    // 1. Inject the Service here so the diagram draws the arrow
    protected ShipmentService $shipmentService;

    public function __construct(ShipmentService $shipmentService)
    {
        $this->shipmentService = $shipmentService;
    }

    public function index(Request $request): Response
    {
        $search = trim((string) $request->query('search', ''));
        $status = (string) $request->query('status', 'all');
        $arrivalDate = (string) $request->query('arrival_date', '');

        $shipments = $this->shipmentService->getPaginatedShipments([
            'search' => $search,
            'status' => $status,
            'arrival_date' => $arrivalDate,
        ]);

        return Inertia::render('shipments/index', [
            'shipments' => $shipments,
            'filters' => compact('search', 'status', 'arrivalDate'),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render(
            'shipments/create',
            $this->shipmentService->getFormDependencies()
        );
    }

    // 2. The Form Request is explicitly referenced here. 
    // GitDiagram will draw an arrow from the Controller to the Request.
    public function store(StoreShipmentRequest $request): RedirectResponse
    {
        $this->shipmentService->create($request->validated());

        return to_route('shipments.index')
            ->with('success', 'Shipment created successfully.');
    }

    public function update(UpdateShipmentRequest $request, Shipment $shipment): RedirectResponse
    {
        $this->shipmentService->update($shipment, $request->validated());

        return to_route('shipments.index')
            ->with('success', 'Shipment updated successfully.');
    }
    
    // ... keep your show, edit, destroy methods as they were


    public function show(
        WarehouseBay $warehouseBay,
        WarehouseBayService $warehouseBayService
    ): Response {
        return Inertia::render('warehouse-bays/show', [
            'bay' => $warehouseBayService
                ->getBayWithShipments($warehouseBay),
        ]);
    }

    public function edit(WarehouseBay $warehouseBay): Response
    {
        return Inertia::render('warehouse-bays/edit', [
            'bay' => $warehouseBay,
        ]);
    }

    public function update(
        UpdateWarehouseBayRequest $request,
        WarehouseBay $warehouseBay,
        WarehouseBayService $warehouseBayService
    ): RedirectResponse {
        $warehouseBayService->update(
            $warehouseBay,
            $request->validated()
        );

        return to_route('warehouse-bays.index')
            ->with('success', 'Warehouse bay updated successfully.');
    }

    public function destroy(
        WarehouseBay $warehouseBay,
        WarehouseBayService $warehouseBayService
    ): RedirectResponse {
        $deleted = $warehouseBayService->delete($warehouseBay);

        if (! $deleted) {
            return to_route('warehouse-bays.index')
                ->with(
                    'error',
                    'This bay cannot be deleted because shipments are assigned to it.'
                );
        }

        return to_route('warehouse-bays.index')
            ->with('success', 'Warehouse bay deleted successfully.');
    }
}
