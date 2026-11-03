<?php

namespace App\Http\Controllers;

use App\Models\BillingStatement;
use App\Services\BillingStatementService;
use Inertia\Inertia;
use Inertia\Response;

class BillingStatementController extends Controller
{
    public function __construct(
        private BillingStatementService $billingStatementService
    ) {}

    public function index(): Response
    {
        return Inertia::render('billing-statements/index', [
            'statements' => $this->billingStatementService
                ->getPaginatedStatements(),
        ]);
    }

    public function show(BillingStatement $billingStatement): Response
    {
        return Inertia::render('billing-statements/show', [
            'billingStatement' => $this->billingStatementService
                ->getStatementWithShipment($billingStatement),
        ]);
    }
}