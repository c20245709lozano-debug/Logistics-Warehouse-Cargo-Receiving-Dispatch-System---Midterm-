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
    protected WarehouseBayService $warehouseBayService;

    public function __construct(WarehouseBayService $warehouseBayService)
    {
        $this->warehouseBayService = $warehouseBayService;
    }

    public function index(): Response
    {
        return Inertia::render('warehouse-bays/index', [
            'bays' => $this->warehouseBayService->getPaginatedBays(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('warehouse-bays/create');
    }

    public function store(StoreWarehouseBayRequest $request): RedirectResponse
    {
        $this->warehouseBayService->create($request->validated());

        return to_route('warehouse-bays.index')
            ->with('success', 'Warehouse bay created successfully.');
    }

    public function show(WarehouseBay $warehouseBay): Response
    {
        return Inertia::render('warehouse-bays/show', [
            'bay' => $this->warehouseBayService->getBayWithShipments($warehouseBay),
        ]);
    }

    public function edit(WarehouseBay $warehouseBay): Response
    {
        return Inertia::render('warehouse-bays/edit', [
            'bay' => $warehouseBay,
        ]);
    }

    public function update(UpdateWarehouseBayRequest $request, WarehouseBay $warehouseBay): RedirectResponse
    {
        $this->warehouseBayService->update(
            $warehouseBay,
            $request->validated()
        );

        return to_route('warehouse-bays.index')
            ->with('success', 'Warehouse bay updated successfully.');
    }

    public function destroy(WarehouseBay $warehouseBay): RedirectResponse
    {
        $deleted = $this->warehouseBayService->delete($warehouseBay);

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