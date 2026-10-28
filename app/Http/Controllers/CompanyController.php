<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCompanyRequest;
use App\Http\Requests\UpdateCompanyRequest;
use App\Models\Company;
use App\Services\CompanyService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class CompanyController extends Controller
{
    public function index(
        CompanyService $companyService
    ): Response {
        return Inertia::render('companies/index', [
            'companies' => $companyService->getPaginatedCompanies(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('companies/create');
    }

    public function store(
        StoreCompanyRequest $request,
        CompanyService $companyService
    ): RedirectResponse {
        $companyService->create($request->validated());

        return to_route('companies.index')
            ->with('success', 'Company added successfully.');
    }

    public function show(
        Company $company,
        CompanyService $companyService
    ): Response {
        return Inertia::render('companies/show', [
            'company' => $companyService
                ->getCompanyWithShipmentCounts($company),
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
        Company $company,
        CompanyService $companyService
    ): RedirectResponse {
        $companyService->update(
            $company,
            $request->validated()
        );

        return to_route('companies.index')
            ->with('success', 'Company updated successfully.');
    }

    public function destroy(
        Company $company,
        CompanyService $companyService
    ): RedirectResponse {
        $companyService->delete($company);

        return to_route('companies.index')
            ->with('success', 'Company deleted successfully.');
    }
}
