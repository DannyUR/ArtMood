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
        Schema::create('reactions', function (Blueprint $table) {
            $table->id('id_reaccion');
            $table->string('emoji', 10);
            $table->timestamp('reacted_at')->useCurrent();

            $table->unsignedBigInteger('id_usuario');
            $table->unsignedBigInteger('id_obra');

            $table->foreign('id_usuario')->references('id_usuario')->on('users')->onDelete('cascade');
            $table->foreign('id_obra')->references('id_obra')->on('works')->onDelete('cascade');

            $table->unique(['id_usuario', 'id_obra', 'emoji']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reactions');
    }
};
