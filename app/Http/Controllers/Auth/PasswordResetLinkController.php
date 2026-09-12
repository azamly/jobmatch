<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class PasswordResetLinkController extends Controller
{
    /**
     * Show the password reset link request page.
     */
    public function create(Request $request): Response
    {
        return Inertia::render('auth/forgot-password', [
            'status' => $request->session()->get('status'),
        ]);
    }

    /**
     * Handle an incoming password reset link request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'email' => 'required_without:phone|email|nullable',
            'phone' => 'required_without:email|string|nullable',
        ]);

        if ($request->filled('email')) {
            Password::sendResetLink($request->only('email'));
        } elseif ($request->filled('phone')) {
            // TODO: Implement SMS sending
            // For now, we'll just create a token and store it
            $token = Str::random(60);
            DB::table('phone_password_reset_tokens')->updateOrInsert(
                ['phone' => $request->phone],
                ['token' => Hash::make($token), 'created_at' => now()]
            );
        }

        return back()->with('status', __('Ссылка для сброса будет отправлена, если учетная запись существует.'));
    }
}
