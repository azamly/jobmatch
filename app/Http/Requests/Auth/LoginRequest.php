<?php

namespace App\Http\Requests\Auth;

use Illuminate\Auth\Events\Lockout;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class LoginRequest extends FormRequest
{
    /**
     * Разрешить выполнение запроса.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Правила валидации.
     */
    public function rules(): array
    {
        return [
            'email' => ['required_without:phone', 'string', 'email', 'nullable'],
            'phone' => ['required_without:email', 'string', 'nullable'],
            'password' => ['required', 'string'],
        ];
    }

    /**
     * Кастомные сообщения об ошибках на русском языке.
     */
    public function messages(): array
    {
        return [
            // 📧 Email
            'email.required_without' => 'Укажите email или номер телефона.',
            'email.string' => 'Email должен быть строкой.',
            'email.email' => 'Укажите корректный адрес электронной почты.',

            // 📱 Телефон
            'phone.required_without' => 'Укажите номер телефона или email.',
            'phone.string' => 'Номер телефона должен быть строкой.',

            // 🔐 Пароль
            'password.required' => 'Пароль обязателен для заполнения.',
            'password.string' => 'Пароль должен быть строкой.',
        ];
    }

    /**
     * Аутентификация пользователя.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function authenticate(): void
    {
        $this->ensureIsNotRateLimited();

        $credentials = $this->only('password');
        if ($this->filled('email')) {
            $credentials['email'] = $this->email;
        } elseif ($this->filled('phone')) {
            $credentials['phone'] = $this->phone;
        }

        if (! Auth::attempt($credentials, $this->boolean('remember'))) {
            RateLimiter::hit($this->throttleKey());

            throw ValidationException::withMessages([
                $this->filled('email') ? 'email' : 'phone' => 'Неверный логин или пароль.',
            ]);
        }

        RateLimiter::clear($this->throttleKey());
    }

    /**
     * Ограничение количества попыток входа.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function ensureIsNotRateLimited(): void
    {
        if (! RateLimiter::tooManyAttempts($this->throttleKey(), 5)) {
            return;
        }

        event(new Lockout($this));

        $seconds = RateLimiter::availableIn($this->throttleKey());

        throw ValidationException::withMessages([
            $this->filled('email') ? 'email' : 'phone' => "Слишком много попыток входа. Попробуйте через {$seconds} сек.",
        ]);
    }

    /**
     * Генерация ключа ограничения по IP и логину.
     */
    public function throttleKey(): string
    {
        $identifier = $this->filled('email') ? $this->string('email') : $this->string('phone');
        return Str::transliterate(Str::lower($identifier).'|'.$this->ip());
    }
}
