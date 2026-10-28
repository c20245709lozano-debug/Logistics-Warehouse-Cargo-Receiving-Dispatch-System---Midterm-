<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCompanyRequest;
use App\Http\Requests\UpdateCompanyRequest;
use App\Models\Company;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class CompanyController extends Controller
{
    public function index(): Response
    {
        $companies = Company::query()
            ->withCount(['sentShipments', 'receivedShipments'])
            ->orderBy('company_name')
            ->paginate(10);

        return Inertia::render('companies/index', [
            'companies' => $companies,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('companies/create');
    }

    public function store(
        StoreCompanyRequest $request
    ): RedirectResponse {
        Company::create($request->validated());

        return to_route('companies.index')
            ->with('success', 'Company added successfully.');
    }

    public function show(Company $company): Response
    {
        $company->loadCount(['sentShipments', 'receivedShipments']);

        return Inertia::render('companies/show', [
            'company' => $company,
        ]);
    }

    public function edit(Company $company): Response
    {
        return Inertia::render('companies/edit', [
            'company' => $company,
        ]);
    }

    public function update(
        UpdateCompanyRequest $request,
        Company $company
    ): RedirectResponse {
        $company->update($request->validated());

        return to_route('companies.index')
            ->with('success', 'Company updated successfully.');
    }

    public function destroy(Company $company): RedirectResponse
    {
        if (
            $company->sentShipments()->exists() ||
            $company->receivedShipments()->exists()
        ) {
            return to_route('companies.index')
                ->with(
                    'error',
                    'This company cannot be deleted because it is linked to existing shipments.'
                );
        }

        $company->delete();

        return to_route('companies.index')
            ->with('success', 'Company deleted successfully.');
    }
}
