<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreCargoCategoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'category_name' => trim(
                (string) $this->input('category_name')
            ),
        ]);
    }

    public function rules(): array
    {
        return [
            'category_name' => [
                'required',
                'string',
                'max:255',
                'unique:cargo_categories,category_name',
            ],
            'daily_storage_rate' => [
                'required',
                'numeric',
                'min:0',
                'max:9999999999.99',
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'category_name.required' =>
                'Please enter the cargo category name.',
            'category_name.string' =>
                'The category name must be valid text.',
            'category_name.max' =>
                'The category name cannot exceed 255 characters.',
            'category_name.unique' =>
                'This cargo category already exists.',

            'daily_storage_rate.required' =>
                'Please enter the daily storage rate.',
            'daily_storage_rate.numeric' =>
                'The daily storage rate must be a number.',
            'daily_storage_rate.min' =>
                'The daily storage rate cannot be negative.',
            'daily_storage_rate.max' =>
                'The daily storage rate exceeds the allowed limit.',
        ];
    }
}
