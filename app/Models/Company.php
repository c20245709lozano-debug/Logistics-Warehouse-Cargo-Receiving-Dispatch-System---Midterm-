<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Company extends Model
{
    use HasFactory;

    protected $fillable = [
        'company_name',
    ];

    public function sentShipments(): HasMany
    {
        return $this->hasMany(Shipment::class, 'sender_company_id');
    }

    public function receivedShipments(): HasMany
    {
        return $this->hasMany(Shipment::class, 'receiver_company_id');
    }
}
