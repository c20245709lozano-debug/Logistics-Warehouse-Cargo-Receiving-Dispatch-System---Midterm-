<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Shipment extends Model
{
    use HasFactory;

    protected $fillable = [
        'sender_company_id',
        'receiver_company_id',
        'cargo_category_id',
        'warehouse_bay_id',
        'weight_kg',
        'volume_cbm',
        'arrival_date',
        'dispatch_date',
    ];

    protected function casts(): array
    {
        return [
            'weight_kg' => 'decimal:2',
            'volume_cbm' => 'decimal:2',
            'arrival_date' => 'date',
            'dispatch_date' => 'date',
        ];
    }

    public function sender(): BelongsTo
    {
        return $this->belongsTo(Company::class, 'sender_company_id');
    }

    public function receiver(): BelongsTo
    {
        return $this->belongsTo(Company::class, 'receiver_company_id');
    }

    public function cargoCategory(): BelongsTo
    {
        return $this->belongsTo(CargoCategory::class);
    }

    public function warehouseBay(): BelongsTo
    {
        return $this->belongsTo(WarehouseBay::class);
    }

    public function billingStatement(): HasOne
    {
        return $this->hasOne(BillingStatement::class);
    }
}
