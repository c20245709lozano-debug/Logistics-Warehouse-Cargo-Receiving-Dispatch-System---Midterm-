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
    public function index(
        Request $request,
        ShipmentService $shipmentService
    ): Response {
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

        $shipments = $shipmentService->getPaginatedShipments([
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

    public function create(ShipmentService $shipmentService): Response
    {
        return Inertia::render(
            'shipments/create',
            $shipmentService->getFormDependencies()
        );
    }

    public function store(
        StoreShipmentRequest $request,
        ShipmentService $shipmentService
    ): RedirectResponse {
        $shipmentService->create($request->validated());

        return to_route('shipments.index')
            ->with('success', 'Shipment created successfully.');
    }

    public function show(
        Shipment $shipment,
        ShipmentService $shipmentService
    ): Response {
        return Inertia::render('shipments/show', [
            'shipment' => $shipmentService
                ->getShipmentWithRelations($shipment),
        ]);
    }

    public function edit(
        Shipment $shipment,
        ShipmentService $shipmentService
    ): Response {
        return Inertia::render('shipments/edit', [
            'shipment' => $shipmentService
                ->getShipmentWithRelations($shipment),
            ...$shipmentService->getFormDependencies(),
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

    public function destroy(
        Shipment $shipment,
        ShipmentService $shipmentService
    ): RedirectResponse {
        $shipmentService->delete($shipment);

        return to_route('shipments.index')
            ->with('success', 'Shipment deleted successfully.');
    }
}