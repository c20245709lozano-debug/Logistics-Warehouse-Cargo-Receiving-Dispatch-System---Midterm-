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

        if (! in_array($status, ['all', 'stored', 'dispatched'], true)) {
            $status = 'all';
        }

        if (
            $arrivalDate !== ''
            && ! preg_match('/^\d{4}-\d{2}-\d{2}$/', $arrivalDate)
        ) {
            $arrivalDate = '';
        }

        $shipments = $this->shipmentService->getPaginatedShipments([
            'search' => $search,
            'status' => $status,
            'arrival_date' => $arrivalDate,
        ]);

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
        return Inertia::render(
            'shipments/create',
            $this->shipmentService->getFormDependencies()
        );
    }

    public function store(StoreShipmentRequest $request): RedirectResponse
    {
        $this->shipmentService->create($request->validated());

        return to_route('shipments.index')
            ->with('success', 'Shipment created successfully.');
    }

    public function show(Shipment $shipment): Response
    {
        return Inertia::render('shipments/show', [
            'shipment' => $this->shipmentService->getShipmentWithRelations($shipment),
        ]);
    }

    public function edit(Shipment $shipment): Response
    {
        return Inertia::render('shipments/edit', [
            'shipment' => $this->shipmentService->getShipmentWithRelations($shipment),
            ...$this->shipmentService->getFormDependencies(),
        ]);
    }

    public function update(UpdateShipmentRequest $request, Shipment $shipment): RedirectResponse
    {
        $this->shipmentService->update($shipment, $request->validated());

        return to_route('shipments.index')
            ->with('success', 'Shipment updated successfully.');
    }

    public function destroy(Shipment $shipment): RedirectResponse
    {
        $this->shipmentService->delete($shipment);

        return to_route('shipments.index')
            ->with('success', 'Shipment deleted successfully.');
    }
}