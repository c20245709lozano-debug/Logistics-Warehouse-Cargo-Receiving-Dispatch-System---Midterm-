<?php

namespace App\Services;

use App\Models\Company;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Validation\ValidationException;

class CompanyService
{
    public function getPaginatedCompanies(): LengthAwarePaginator
    {
        return Company::query()
            ->withCount(['sentShipments', 'receivedShipments'])
            ->orderBy('company_name')
            ->paginate(10);
    }

    public function getCompanyWithShipmentCounts(
        Company $company
    ): Company {
        return $company->loadCount([
            'sentShipments',
            'receivedShipments',
        ]);
    }

    public function create(array $data): Company
    {
        return Company::create($data);
    }

    public function update(
        Company $company,
        array $data
    ): Company {
        $company->update($data);

        return $company->refresh();
    }

    public function delete(Company $company): void
    {
        if (
            $company->sentShipments()->exists() ||
            $company->receivedShipments()->exists()
        ) {
            throw ValidationException::withMessages([
                'company' =>
                    'This company cannot be deleted because it is linked to existing shipments.',
            ]);
        }

        $company->delete();
    }
}
