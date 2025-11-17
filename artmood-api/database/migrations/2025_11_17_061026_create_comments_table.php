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
        Schema::create('comments', function (Blueprint $table) {
            $table->id('id_comentario');
            $table->text('content');
            $table->timestamp('commented_at')->useCurrent();
            $table->enum('status', ['visible', 'hidden', 'deleted'])->default('visible');

            $table->unsignedBigInteger('id_usuario');
            $table->unsignedBigInteger('id_obra');

            $table->foreign('id_usuario')->references('id_usuario')->on('users')->onDelete('cascade');
            $table->foreign('id_obra')->references('id_obra')->on('works')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('comments');
    }
};
