
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('shipments', function (Blueprint $table) {
            $table->id();

            $table->foreignId('sender_company_id')
                ->constrained('companies')
                ->restrictOnDelete();

            $table->foreignId('receiver_company_id')
                ->constrained('companies')
                ->restrictOnDelete();

            $table->foreignId('cargo_category_id')
                ->constrained('cargo_categories')
                ->restrictOnDelete();

            $table->foreignId('warehouse_bay_id')
                ->constrained('warehouse_bays')
                ->restrictOnDelete();

            $table->decimal('weight_kg', 12, 2);
            $table->decimal('volume_cbm', 12, 2);
            $table->date('arrival_date');
            $table->date('dispatch_date')->nullable();

            $table->timestamps();

            $table->index(['arrival_date', 'dispatch_date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('shipments');
    }
};
