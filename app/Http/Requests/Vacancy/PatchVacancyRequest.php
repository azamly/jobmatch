<?php

namespace App\Http\Requests\Vacancy;

use App\Models\Employer\Employer;
use Illuminate\Foundation\Http\FormRequest;

class PatchVacancyRequest extends FormRequest
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
            'title' => 'required|string|min:3|max:100',
            'description' => 'nullable|string|min:3|max:255',
            'salary_type' => 'required|string|in:accord,money',
            'salary_start' => 'required|numeric|min:0',
            'salary_end' => 'required|numeric|min:0',
            'qualifications' => 'nullable|string|min:3|max:255',
            'benefits' => 'nullable|string|min:3|max:255',
            'responsibility' => 'nullable|string|min:3|max:255',
            'education' => 'required|string|min:3|max:255|in:Среднее,Среднее специальное,Высшее (бакалавр),Магистр,Доктор наук',
            'experience' => 'required|string|min:3|max:255|in:Нет опыта,До 1 года,От 1 до 3 лет,От 3 до 5 лет,Больше 5 лет',
            'location' => 'required|string|min:3|max:255',
            'type' => 'nullable|string|min:3|max:255',
            'status' => 'nullable|string|in:active,inactive',
            'skills' => 'required|array',
            'skills.*' => 'required|string|min:2|max:255',
            'industry_id' => 'required|integer'
        ];
    }
}
