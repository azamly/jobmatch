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
        Schema::create('vacancies', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employer_id')->constrained('employers')->onDelete('cascade');
            $table->string('title');
            $table->enum('salary_type',['money','accord'])->default('money');
            $table->integer('salary_start')->default(0);
            $table->integer('salary_end')->default(0);
            $table->string('location');
            $table->foreignId('industry_id')->constrained('industries')->onDelete('cascade');
            $table->text('description')->nullable();
            $table->text('benefits')->nullable();         // льготы и бонусы
            $table->text('responsibility')->nullable();   // обязанности
            $table->text('qualifications')->nullable();   // требования
            $table->string('experience')->nullable();     // опыт работы (например: "2 года", "без опыта")
            $table->string('education')->nullable();
            $table->json('skills')->nullable();
            $table->enum('type',[    'full',        // Полная занятость
                'part',        // Частичная занятость
                'remote',      // Удалённая работа
                'contract',    // Контракт / проектная работа
                'internship',  // Стажировка
                'temporary'    // Временная работа (сезонная, подмены)
            ])->default('full');
            $table->enum('status',['active','inactive'])->default('active');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vacancies');
    }
};
