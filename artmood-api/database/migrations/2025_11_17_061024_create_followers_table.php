<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('followers', function (Blueprint $table) {
            $table->unsignedBigInteger('id_seguidor');
            $table->unsignedBigInteger('id_seguido');
            $table->timestamp('followed_at')->useCurrent();

            $table->primary(['id_seguidor', 'id_seguido']);

            $table->foreign('id_seguidor')->references('id_usuario')->on('users')->onDelete('cascade');
            $table->foreign('id_seguido')->references('id_usuario')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('followers');
    }
};
