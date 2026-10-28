<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreWarehouseBayRequest;
use App\Http\Requests\UpdateWarehouseBayRequest;
use App\Models\WarehouseBay;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class WarehouseBayController extends Controller
{
    
public function index(): Response
{
    $bays = WarehouseBay::withCount([
        'shipments as occupied_shipments_count' => function ($query) {
            $query->where(function ($query) {
                $query->whereNull('dispatch_date')
                    ->orWhereDate('dispatch_date', '>', today());
            });
        },
    ])
        ->orderBy('bay_code')
        ->paginate(10);

    return Inertia::render('warehouse-bays/index', [
        'bays' => $bays,
    ]);
}


    public function create(): Response
    {
        return Inertia::render('warehouse-bays/create');
    }

    public function store(
        StoreWarehouseBayRequest $request
    ): RedirectResponse {
        WarehouseBay::create($request->validated());

        return to_route('warehouse-bays.index')
            ->with('success', 'Warehouse bay created successfully.');
    }

    public function show(WarehouseBay $warehouseBay): Response
    {
        $warehouseBay->load([
            'shipments.sender',
            'shipments.receiver',
            'shipments.cargoCategory',
        ]);

        return Inertia::render('warehouse-bays/show', [
            'bay' => $warehouseBay,
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
    WarehouseBay $warehouseBay
): RedirectResponse {
    $data = $request->validated();

    DB::transaction(function () use ($data, $warehouseBay) {
        $bay = WarehouseBay::query()
            ->whereKey($warehouseBay->id)
            ->lockForUpdate()
            ->firstOrFail();

        $activeShipments = $bay->shipments()
            ->where(function ($query) {
                $query->whereNull('dispatch_date')
                    ->orWhereDate('dispatch_date', '>', today());
            });

        $currentWeight = (float) (clone $activeShipments)
            ->sum('weight_kg');

        $currentVolume = (float) (clone $activeShipments)
            ->sum('volume_cbm');

        if ((float) $data['max_weight_kg'] < $currentWeight) {
            throw ValidationException::withMessages([
                'max_weight_kg' =>
                    'The new maximum weight cannot be lower than the total weight of cargo currently stored in this bay.',
            ]);
        }

        if ((float) $data['max_volume_cbm'] < $currentVolume) {
            throw ValidationException::withMessages([
                'max_volume_cbm' =>
                    'The new maximum volume cannot be lower than the total volume of cargo currently stored in this bay.',
            ]);
        }

        $bay->update($data);
    });

    return to_route('warehouse-bays.index')
        ->with('success', 'Warehouse bay updated successfully.');
}




    
public function destroy(
    WarehouseBay $warehouseBay
): RedirectResponse {
    try {
        DB::transaction(function () use ($warehouseBay) {
            $bay = WarehouseBay::query()
                ->whereKey($warehouseBay->id)
                ->lockForUpdate()
                ->firstOrFail();

            if ($bay->shipments()->exists()) {
                throw ValidationException::withMessages([
                    'warehouse_bay' =>
                        'This bay cannot be deleted because shipments are assigned to it.',
                ]);
            }

            $bay->delete();
        });
    } catch (ValidationException $exception) {
        return to_route('warehouse-bays.index')
            ->with('error', 'This bay cannot be deleted because shipments are assigned to it.');
    }

    return to_route('warehouse-bays.index')
        ->with('success', 'Warehouse bay deleted successfully.');
}
}