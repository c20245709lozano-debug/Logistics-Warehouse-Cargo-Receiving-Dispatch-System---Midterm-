<?php

namespace App\Services;

use App\Models\BillingStatement;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class BillingStatementService
{
    private array $shipmentRelations = [
        'shipment.sender',
        'shipment.receiver',
        'shipment.cargoCategory',
        'shipment.warehouseBay',
    ];

    public function getPaginatedStatements(): LengthAwarePaginator
    {
        return BillingStatement::with($this->shipmentRelations)
            ->latest()
            ->paginate(10);
    }

    public function getStatementWithShipment(
        BillingStatement $billingStatement
    ): BillingStatement {
        return $billingStatement->load($this->shipmentRelations);
    }
}