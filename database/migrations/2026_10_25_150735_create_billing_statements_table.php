
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('billing_statements', function (Blueprint $table) {
            $table->id();

            $table->foreignId('shipment_id')
                ->unique()
                ->constrained('shipments')
                ->cascadeOnDelete();

            $table->decimal('storage_fee', 12, 2)->default(0);
            $table->decimal('shipping_fee', 12, 2)->default(0);
            $table->decimal('total_cost', 12, 2)->default(0);

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('billing_statements');
    }
};
