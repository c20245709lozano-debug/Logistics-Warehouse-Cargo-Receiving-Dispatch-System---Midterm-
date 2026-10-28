<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateCompanyRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'company_name' => trim(
                (string) $this->input('company_name')
            ),
        ]);
    }

    public function rules(): array
    {
        $company = $this->route('company');

        return [
            'company_name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('companies', 'company_name')
                    ->ignore($company),
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'company_name.required' =>
                'Please enter the company name.',
            'company_name.string' =>
                'The company name must be valid text.',
            'company_name.max' =>
                'The company name cannot exceed 255 characters.',
            'company_name.unique' =>
                'This company name already exists.',
        ];
    }
}
