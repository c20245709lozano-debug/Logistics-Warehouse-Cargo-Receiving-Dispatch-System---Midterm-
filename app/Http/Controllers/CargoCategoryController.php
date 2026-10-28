<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCargoCategoryRequest;
use App\Http\Requests\UpdateCargoCategoryRequest;
use App\Models\CargoCategory;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class CargoCategoryController extends Controller
{
    public function index(): Response
    {
        $categories = CargoCategory::query()
            ->orderBy('category_name')
            ->paginate(10);

        return Inertia::render('cargo-categories/index', [
            'categories' => $categories,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('cargo-categories/create');
    }

    public function store(
        StoreCargoCategoryRequest $request
    ): RedirectResponse {
        CargoCategory::create($request->validated());

        return to_route('cargo-categories.index')
            ->with('success', 'Cargo category added successfully.');
    }

    public function show(CargoCategory $cargoCategory): Response
    {
        $cargoCategory->loadCount('shipments');

        return Inertia::render('cargo-categories/show', [
            'category' => $cargoCategory,
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
        CargoCategory $cargoCategory
    ): RedirectResponse {
        $cargoCategory->update($request->validated());

        return to_route('cargo-categories.index')
            ->with('success', 'Cargo category updated successfully.');
    }

    public function destroy(
        CargoCategory $cargoCategory
    ): RedirectResponse {
        if ($cargoCategory->shipments()->exists()) {
            return to_route('cargo-categories.index')
                ->with(
                    'error',
                    'This category cannot be deleted because it is linked to existing shipments.'
                );
        }

        $cargoCategory->delete();

        return to_route('cargo-categories.index')
            ->with('success', 'Cargo category deleted successfully.');
    }
}
