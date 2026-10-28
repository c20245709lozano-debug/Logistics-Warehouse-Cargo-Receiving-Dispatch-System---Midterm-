<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCargoCategoryRequest;
use App\Http\Requests\UpdateCargoCategoryRequest;
use App\Models\CargoCategory;
use App\Services\CargoCategoryService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class CargoCategoryController extends Controller
{
    public function index(
        CargoCategoryService $cargoCategoryService
    ): Response {
        return Inertia::render('cargo-categories/index', [
            'categories' => $cargoCategoryService
                ->getPaginatedCategories(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('cargo-categories/create');
    }

    public function store(
        StoreCargoCategoryRequest $request,
        CargoCategoryService $cargoCategoryService
    ): RedirectResponse {
        $cargoCategoryService->create($request->validated());

        return to_route('cargo-categories.index')
            ->with('success', 'Cargo category added successfully.');
    }

    public function show(
        CargoCategory $cargoCategory,
        CargoCategoryService $cargoCategoryService
    ): Response {
        return Inertia::render('cargo-categories/show', [
            'category' => $cargoCategoryService
                ->getCategoryWithShipmentCount($cargoCategory),
        ]);
    }

    public function edit(CargoCategory $cargoCategory): Response
    {
        return Inertia::render('cargo-categories/edit', [
            'category' => $cargoCategory,
        ]);
    }

    public function update(
        UpdateCargoCategoryRequest $request,
        CargoCategory $cargoCategory,
        CargoCategoryService $cargoCategoryService
    ): RedirectResponse {
        $cargoCategoryService->update(
            $cargoCategory,
            $request->validated()
        );

        return to_route('cargo-categories.index')
            ->with('success', 'Cargo category updated successfully.');
    }

    public function destroy(
        CargoCategory $cargoCategory,
        CargoCategoryService $cargoCategoryService
    ): RedirectResponse {
        $deleted = $cargoCategoryService->delete($cargoCategory);

        if (! $deleted) {
            return to_route('cargo-categories.index')
                ->with(
                    'error',
                    'This category cannot be deleted because it is linked to existing shipments.'
                );
        }

        return to_route('cargo-categories.index')
            ->with('success', 'Cargo category deleted successfully.');
    }
}
