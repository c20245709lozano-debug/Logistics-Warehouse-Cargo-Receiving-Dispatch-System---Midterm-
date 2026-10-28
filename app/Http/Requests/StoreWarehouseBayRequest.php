<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreWarehouseBayRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'bay_code' => strtoupper(
                trim((string) $this->input('bay_code'))
            ),
        ]);
    }

    public function rules(): array
    {
        return [
            'bay_code' => [
                'required',
                'string',
                'max:50',
                'unique:warehouse_bays,bay_code',
            ],
            'max_weight_kg' => [
                'required',
                'numeric',
                'gt:0',
                'max:9999999999.99',
            ],
            'max_volume_cbm' => [
                'required',
                'numeric',
                'gt:0',
                'max:9999999999.99',
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'bay_code.required' =>
                'Please enter a warehouse bay code.',
            'bay_code.string' =>
                'The warehouse bay code must be text.',
            'bay_code.unique' =>
                'This warehouse bay code already exists.',
            'bay_code.max' =>
                'The bay code cannot exceed 50 characters.',

            'max_weight_kg.required' =>
                'Please enter the maximum weight capacity.',
            'max_weight_kg.numeric' =>
                'The maximum weight must be a number.',
            'max_weight_kg.gt' =>
                'The maximum weight must be greater than zero.',
            'max_weight_kg.max' =>
                'The maximum weight exceeds the allowed limit.',

            'max_volume_cbm.required' =>
                'Please enter the maximum volume capacity.',
            'max_volume_cbm.numeric' =>
                'The maximum volume must be a number.',
            'max_volume_cbm.gt' =>
                'The maximum volume must be greater than zero.',
            'max_volume_cbm.max' =>
                'The maximum volume exceeds the allowed limit.',
        ];
    }
}
