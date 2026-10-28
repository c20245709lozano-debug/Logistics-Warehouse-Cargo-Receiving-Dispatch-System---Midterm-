<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreWarehouseBayRequest;
use App\Http\Requests\UpdateWarehouseBayRequest;
use App\Models\WarehouseBay;
use App\Services\WarehouseBayService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class WarehouseBayController extends Controller
{
    public function index(
        WarehouseBayService $warehouseBayService
    ): Response {
        return Inertia::render('warehouse-bays/index', [
            'bays' => $warehouseBayService->getPaginatedBays(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('warehouse-bays/create');
    }

    public function store(
        StoreWarehouseBayRequest $request,
        WarehouseBayService $warehouseBayService
    ): RedirectResponse {
        $warehouseBayService->create($request->validated());

        return to_route('warehouse-bays.index')
            ->with('success', 'Warehouse bay created successfully.');
    }

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
