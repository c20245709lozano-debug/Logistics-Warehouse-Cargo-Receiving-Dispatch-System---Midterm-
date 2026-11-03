<?php

namespace App\Services;

use App\Models\Company;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class CompanyService
{
    public function getPaginatedCompanies(): LengthAwarePaginator
    {
        return Company::withCount(['sentShipments', 'receivedShipments'])
            ->orderBy('company_name')
            ->paginate(10);
    }

    public function getCompanyWithShipmentCounts(Company $company): Company
    {
        return $company->loadCount(['sentShipments', 'receivedShipments']);
    }

    public function create(array $data): Company
    {
        return DB::transaction(function () use ($data) {
            return Company::create($this->sanitizeData($data));
        });
    }

    public function update(Company $company, array $data): Company
    {
        return DB::transaction(function () use ($company, $data) {
            $company->update($this->sanitizeData($data));
            return $company->refresh();
        });
    }

    public function delete(Company $company): bool
    {
        return DB::transaction(function () use ($company) {
            if ($company->sentShipments()->exists() ||
                $company->receivedShipments()->exists()) {
                throw ValidationException::withMessages([
                    'company' => 'This company cannot be deleted because it has shipment records.',
                ]);
            }

            return $company->delete();
        });
    }

    private function sanitizeData(array $data): array
    {
        if (array_key_exists('company_name', $data)) {
            $name = strip_tags((string) $data['company_name']);
            $name = preg_replace('/\s+/u', ' ', $name) ?? $name;
            $data['company_name'] = trim($name);

            if ($data['company_name'] === '') {
                throw ValidationException::withMessages([
                    'company_name' => 'The company name is required.',
                ]);
            }
        }

        return $data;
    }
}