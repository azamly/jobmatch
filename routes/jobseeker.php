<?php


use App\Http\Controllers\Settings\JobSeekerController;
use App\Http\Controllers\VacancyController;
use Illuminate\Support\Facades\Route;

Route::middleware('role:jobseeker')->group(function () {
    Route::get('/settings/jobseeker',[JobSeekerController::class,'index'])->name('jobseeker.index');
    Route::post('/settings/jobseeker/upload',[JobSeekerController::class,'store'])->name('jobseeker.store');
    Route::get('/settings/jobseeker/edit', [JobSeekerController::class, 'edit'])->name('jobseeker.edit');
    Route::patch('settings/jobseeker/patch', [JobSeekerController::class, 'patch'])->name('jobseeker.patch');

    Route::get('/vacancies/{vacancy}/more',[VacancyController::class,'more'])->name('vacancies.more');
    Route::post('/vacancies/{vacancy}/save',[VacancyController::class,'save'])->name('vacancies.save');
    Route::get('/vacancies/{vacancy}/apply',[VacancyController::class,'application'])->name('vacancies.application');
    Route::post('/vacancies/{vacancy}/apply',[VacancyController::class,'applicationStore'])->name('vacancies.application.store');
    Route::patch('/vacancies/{vacancy}/view',[VacancyController::class,'view'])->name('vacancies.view');

    Route::get('/vacancy/jobseeker/application',[VacancyController::class,'apply'])->name('vacancies.apply');
    Route::get('/vacancy/jobseeker/saves',[VacancyController::class,'saves'])->name('vacancies.saves');
});
