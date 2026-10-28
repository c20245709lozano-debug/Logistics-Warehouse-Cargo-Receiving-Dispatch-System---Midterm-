<?php

namespace App\Http\Controllers;

use App\Models\BillingStatement;
use Inertia\Inertia;
use Inertia\Response;

class BillingStatementController extends Controller
{
    /**
     * Display all existing billing statements.
     */
    public function index(): Response
    {
        $statements = BillingStatement::query()
            ->with([
                'shipment.sender',
                'shipment.receiver',
                'shipment.cargoCategory',
                'shipment.warehouseBay',
            ])
            ->latest()
            ->paginate(10);

        return Inertia::render('billing-statements/index', [
            'statements' => $statements,
        ]);
    }

    /**
     * Display one billing statement.
     */
    public function show(
        BillingStatement $billingStatement
    ): Response {
        $billingStatement->load([
            'shipment.sender',
            'shipment.receiver',
            'shipment.cargoCategory',
            'shipment.warehouseBay',
        ]);

        return Inertia::render('billing-statements/show', [
            'statement' => $billingStatement,
        ]);
    }
}
