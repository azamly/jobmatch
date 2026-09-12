<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Employer\Employer;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Validation\Rules;
use Illuminate\Validation\Rules\Password;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Show the registration page.
     */
    public function create(): Response
    {
        return Inertia::render('auth/register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        // 🧭 Ограничение частоты регистраций с одного IP
        $this->ensureIsNotRateLimited($request);

        // 🧰 Безопасная валидация
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required_without:phone',
                'max:255',
                'unique:users,email',
            ],
            'phone' => [
                'required_without:email',
                'regex:/^\+?[0-9]{9,15}$/',
                'unique:users,phone',
            ],
            'password' => [
                'required',
                'confirmed',
                Password::min(8)
                    ->numbers()
                    ->uncompromised(),
            ],
            'role' => ['required', 'string', 'in:jobseeker,employer'],
        ], [
            // 🧍‍ Имя
            'name.required' => 'Имя обязательно для заполнения.',
            'name.string' => 'Имя должно быть строкой.',
            'name.max' => 'Имя не должно превышать 255 символов.',

            // 📧 Email
            'email.required_without' => 'Укажите email или номер телефона.',
            'email.email' => 'Укажите корректный адрес электронной почты.',
            'email.max' => 'Email не должен превышать 255 символов.',
            'email.unique' => 'Невозможно зарегистрироваться с этим email — он уже используется.',

            // 📱 Телефон
            'phone.required_without' => 'Укажите номер телефона или email.',
            'phone.regex' => 'Номер телефона должен быть в формате +992999999999 (от 9 до 15 цифр).',
            'phone.unique' => 'Невозможно зарегистрироваться с этим номером телефона — он уже используется.',

            // 🔐 Пароль
            'password.required' => 'Пароль обязателен для заполнения.',
            'password.confirmed' => 'Пароли не совпадают.',
            'password.min' => 'Пароль должен содержать не менее 8 символов.',
            'password.numbers' => 'Пароль должен содержать хотя бы одну цифру.',
            'password.uncompromised' => 'Этот пароль скомпрометирован — используйте другой.',

            // 🧭 Роль
            'role.required' => 'Выберите роль (соискатель или работодатель).',
            'role.string' => 'Роль должна быть строкой.',
            'role.in' => 'Выбранная роль недопустима.',
        ]);


        // 🔐 Подготовка данных к сохранению
        $userData = [
            'name' => $validated['name'],
            'password' => Hash::make($validated['password']),
        ];

        if (!empty($validated['email'])) {
            $userData['email'] = strtolower($validated['email']);
        }

        if (!empty($validated['phone'])) {
            $userData['phone'] = $validated['phone'];
        }

        // 🧱 Защита от mass assignment — убедись, что в модели User указаны $fillable
        $user = User::create($userData);

        $user->assignRole($validated['role']);

        // 👔 Создание работодателя при регистрации
        if ($validated['role'] === 'employer') {
            Employer::create([
                'user_id' => $user->id,
            ]);
        }

        event(new Registered($user));

        Auth::login($user);

        return redirect()->intended(route('dashboard', absolute: false));
    }

    protected function ensureIsNotRateLimited(Request $request): void
    {
        $key = 'register:' . $request->ip();

        // Разрешаем 5 попыток за 1 минуту
        RateLimiter::for('register', function () use ($key) {
            return Limit::perMinute(5)->by($key);
        });

        if (RateLimiter::tooManyAttempts($key, 5)) {
            throw ValidationException::withMessages([
                'email' => 'Слишком много попыток. Попробуйте через минуту.',
            ]);
        }

        RateLimiter::hit($key);
    }

}
