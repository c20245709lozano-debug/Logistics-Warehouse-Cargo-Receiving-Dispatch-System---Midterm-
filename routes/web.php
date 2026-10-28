<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\CompanyController;
use App\Http\Controllers\CargoCategoryController;
use App\Http\Controllers\WarehouseBayController;
use App\Http\Controllers\ShipmentController;
use App\Http\Controllers\BillingStatementController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])
        ->name('dashboard');

    Route::resource('companies', CompanyController::class);
    Route::resource('cargo-categories', CargoCategoryController::class);
    Route::resource('warehouse-bays', WarehouseBayController::class);
    Route::resource('shipments', ShipmentController::class);
    Route::resource('billing-statements', BillingStatementController::class);
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
