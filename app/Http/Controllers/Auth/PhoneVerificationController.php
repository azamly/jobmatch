<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class PhoneVerificationController extends Controller
{
    /**
     * Show the phone verification page.
     */
    public function show(Request $request): Response
    {
        return Inertia::render('auth/verify-phone', [
            'phone' => $request->user()->phone,
            'status' => session('status'),
        ]);
    }
    /**
     * Send verification code.
     */
    public function send(Request $request): RedirectResponse
    {
        $request->validate([
            'phone' => 'required|string',
        ]);

        $code = rand(100000, 999999);
        
        // TODO: Implement SMS sending
        // For now, we'll just store the code
        DB::table('phone_verification_codes')->updateOrInsert(
            ['phone' => $request->phone],
            [
                'code' => Hash::make($code),
                'created_at' => now(),
                'expires_at' => now()->addMinutes(10)
            ]
        );

        return back()->with('status', __('Код подтверждения отправлен.'));
    }

    /**
     * Verify phone number.
     */
    public function verify(Request $request): RedirectResponse
    {
        $request->validate([
            'phone' => 'required|string',
            'code' => 'required|string',
        ]);

        $record = DB::table('phone_verification_codes')
            ->where('phone', $request->phone)
            ->first();

        if (!$record || 
            !Hash::check($request->code, $record->code) || 
            now()->isAfter($record->expires_at)) {
            throw ValidationException::withMessages([
                'code' => [__('Неверный или просроченный код подтверждения.')],
            ]);
        }

        $request->user()->markPhoneAsVerified();

        DB::table('phone_verification_codes')
            ->where('phone', $request->phone)
            ->delete();

        return back()->with('status', __('Номер телефона подтвержден.'));
    }
}
