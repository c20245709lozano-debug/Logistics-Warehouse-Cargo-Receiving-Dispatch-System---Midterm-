<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CargoCategory extends Model
{
    use HasFactory;

    protected $fillable = [
        'category_name',
        'daily_storage_rate',
    ];

    protected function casts(): array
    {
        return [
            'daily_storage_rate' => 'decimal:2',
        ];
    }

    public function shipments(): HasMany
    {
        return $this->hasMany(Shipment::class);
    }
}
