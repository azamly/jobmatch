<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next,string $role): Response
    {
        if (!Auth::check()) {
            return redirect('/login'); // Если не авторизован — на вход
        }

        $user = Auth::user();

        if (!$user->hasRole($role)) {
            // Можно перенаправить на главную или страницу ошибки
            return redirect('/')->with('error', 'У вас недостаточно прав для доступа.');
        }

        return $next($request);
    }
}
