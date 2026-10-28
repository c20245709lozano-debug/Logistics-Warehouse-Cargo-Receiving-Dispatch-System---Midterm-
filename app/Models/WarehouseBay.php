<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class WarehouseBay extends Model
{
    use HasFactory;

    protected $fillable = [
        'bay_code',
        'max_weight_kg',
        'max_volume_cbm',
    ];

    protected function casts(): array
    {
        return [
            'max_weight_kg' => 'decimal:2',
            'max_volume_cbm' => 'decimal:2',
        ];
    }

    public function shipments(): HasMany
    {
        return $this->hasMany(Shipment::class);
    }
}
