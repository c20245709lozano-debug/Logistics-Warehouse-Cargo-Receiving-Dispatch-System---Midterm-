<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateShipmentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'dispatch_date' => $this->input('dispatch_date') ?: null,
        ]);
    }

    public function rules(): array
    {
        return [
            'sender_company_id' => [
                'required',
                'integer',
                'exists:companies,id',
                'different:receiver_company_id',
            ],
            'receiver_company_id' => [
                'required',
                'integer',
                'exists:companies,id',
            ],
            'cargo_category_id' => [
                'required',
                'integer',
                'exists:cargo_categories,id',
            ],
            'warehouse_bay_id' => [
                'required',
                'integer',
                'exists:warehouse_bays,id',
            ],
            'weight_kg' => [
                'required',
                'numeric',
                'gt:0',
                'max:9999999999.99',
            ],
            'volume_cbm' => [
                'required',
                'numeric',
                'gt:0',
                'max:9999999999.99',
            ],
            'arrival_date' => [
                'required',
                'date',
            ],
            'dispatch_date' => [
                'nullable',
                'date',
                'after_or_equal:arrival_date',
            ],
            'shipping_fee' => [
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
            'sender_company_id.required' =>
                'Please select a sender company.',
            'sender_company_id.integer' =>
                'The sender company selection is invalid.',
            'sender_company_id.exists' =>
                'The selected sender company does not exist.',
            'sender_company_id.different' =>
                'The sender and receiver must be different companies.',

            'receiver_company_id.required' =>
                'Please select a receiver company.',
            'receiver_company_id.integer' =>
                'The receiver company selection is invalid.',
            'receiver_company_id.exists' =>
                'The selected receiver company does not exist.',

            'cargo_category_id.required' =>
                'Please select a cargo category.',
            'cargo_category_id.integer' =>
                'The cargo category selection is invalid.',
            'cargo_category_id.exists' =>
                'The selected cargo category does not exist.',

            'warehouse_bay_id.required' =>
                'Please select a warehouse bay.',
            'warehouse_bay_id.integer' =>
                'The warehouse bay selection is invalid.',
            'warehouse_bay_id.exists' =>
                'The selected warehouse bay does not exist.',

            'weight_kg.required' =>
                'Please enter the cargo weight.',
            'weight_kg.numeric' =>
                'The cargo weight must be a number.',
            'weight_kg.gt' =>
                'Cargo weight must be greater than zero.',
            'weight_kg.max' =>
                'The cargo weight exceeds the allowed limit.',

            'volume_cbm.required' =>
                'Please enter the cargo volume.',
            'volume_cbm.numeric' =>
                'The cargo volume must be a number.',
            'volume_cbm.gt' =>
                'Cargo volume must be greater than zero.',
            'volume_cbm.max' =>
                'The cargo volume exceeds the allowed limit.',

            'arrival_date.required' =>
                'Please provide the arrival date.',
            'arrival_date.date' =>
                'Please enter a valid arrival date.',

            'dispatch_date.date' =>
                'Please enter a valid dispatch date.',
            'dispatch_date.after_or_equal' =>
                'The dispatch date must be on or after the arrival date.',

            'shipping_fee.required' =>
                'Please enter the shipping fee.',
            'shipping_fee.numeric' =>
                'The shipping fee must be a valid number.',
            'shipping_fee.min' =>
                'The shipping fee cannot be negative.',
            'shipping_fee.max' =>
                'The shipping fee is too large.',
        ];
    }
}
