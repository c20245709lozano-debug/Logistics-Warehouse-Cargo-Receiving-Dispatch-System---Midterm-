
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('warehouse_bays', function (Blueprint $table) {
            $table->id();
            $table->string('bay_code')->unique();
            $table->decimal('max_weight_kg', 12, 2);
            $table->decimal('max_volume_cbm', 12, 2);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('warehouse_bays');
    }
};
