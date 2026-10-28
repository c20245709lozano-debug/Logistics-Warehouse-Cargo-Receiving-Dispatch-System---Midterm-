<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BillingStatement extends Model
{
    use HasFactory;

    protected $fillable = [
        'shipment_id',
        'storage_fee',
        'shipping_fee',
        'total_cost',
    ];

    protected function casts(): array
    {
        return [
            'storage_fee' => 'decimal:2',
            'shipping_fee' => 'decimal:2',
            'total_cost' => 'decimal:2',
        ];
    }

    public function shipment(): BelongsTo
    {
        return $this->belongsTo(Shipment::class);
    }
}
