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
        Schema::create('works', function (Blueprint $table) {
            $table->id('id_obra');
            $table->string('title', 150);
            $table->text('description')->nullable();
            $table->string('image', 255);
            $table->timestamp('published_at')->useCurrent();

            $table->unsignedBigInteger('id_usuario');
            $table->unsignedBigInteger('id_categoria')->nullable();
            $table->unsignedBigInteger('id_emocion')->nullable();

            $table->foreign('id_usuario')->references('id_usuario')->on('users')->onDelete('cascade');
            $table->foreign('id_categoria')->references('id_categoria')->on('categories')->onDelete('set null');
            $table->foreign('id_emocion')->references('id_emocion')->on('emotions')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('works');
    }
};
