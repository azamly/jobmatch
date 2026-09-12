<?php


use App\Http\Controllers\VacancyController;
use Illuminate\Support\Facades\Route;

Route::middleware('role:employer')->group(function () {
    Route::get('/settings/employer',[\App\Http\Controllers\Settings\EmployerController::class,'edit'])->name('employer.edit');
    Route::patch('/settings/employer',[\App\Http\Controllers\Settings\EmployerController::class,'patch'])->name('employer.patch');

    Route::resource('/vacancies',VacancyController::class)->except('update');
    Route::patch('/vacancies/{vacancy}',[VacancyController::class,'patch'])->name('vacancies.patch');

    Route::get('/vacancy-applications',[\App\Http\Controllers\Settings\EmployerController::class,'vacancyApplication'])->name('vacancy-applications.show');
    Route::post('/application-status',[\App\Http\Controllers\Settings\EmployerController::class,'applicationStatus'])->name('application-status');
});
