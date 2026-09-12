<?php

use App\Http\Controllers\ChatController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    $users = \App\Models\User::all()->count();
    $employers = \App\Models\Employer\Employer::all()->count();
    return Inertia::render('welcome',[
        'users'=>$users,
        'employers'=>$employers
    ]);
})->name('home');

Route::middleware(['auth','verified'])->group(function () {
    Route::get('dashboard',[\App\Http\Controllers\DashboardController::class,'index'])->name('dashboard');
});
Route::get('/recommended-vacancy/{profileId}',[\App\Http\Controllers\RecommendedController::class,'recommendVacancy'])->name('recommended.vacancy');
Route::post('/recommended-user',[\App\Http\Controllers\RecommendedController::class,'recommendUser'])->name('recommended.user');

Route::middleware('auth')->group(function () {
    Route::get('/chat',[ChatController::class,'index'])->name('chat');
    Route::get('/chat/conversation/{user}', [ChatController::class, 'conversation']);
    Route::post('/chat/send', [ChatController::class, 'send']);
    Route::get('/chat-conversation/{userID}', [ChatController::class, 'chatConversation'])->name('chat.conversation');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
require __DIR__.'/employer.php';
require __DIR__.'/jobseeker.php';
