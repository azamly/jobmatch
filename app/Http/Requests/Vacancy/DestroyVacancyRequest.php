<?php

namespace App\Http\Requests\Vacancy;

use App\Models\Employer\Employer;
use Illuminate\Foundation\Http\FormRequest;

class DestroyVacancyRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $user = $this->user();
        $employer = Employer::where('user_id', $user->id)->first();

        if ($user->hasRole('employer')) {
            return $this->route('vacancy')->employer_id === $employer->id;
        }

        return false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            //
        ];
    }
}
