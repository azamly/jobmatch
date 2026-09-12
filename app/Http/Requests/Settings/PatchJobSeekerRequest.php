<?php

namespace App\Http\Requests\Settings;

use Illuminate\Foundation\Http\FormRequest;

class PatchJobSeekerRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'gender' => ['required', 'string', 'in:male,female,unspecified'],
            'about' => ['nullable', 'string'],
            'phone' => ['nullable', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255'],
            'country' => ['nullable', 'string', 'max:255'],
            'city' => ['nullable', 'string', 'max:255'],
            'address' => ['nullable', 'string', 'max:255'],
            'education' => ['array'],
            'education.*.id' => ['required', 'integer'],
            'education.*.institution' => ['required', 'string', 'max:255'],
            'education.*.degree' => ['required', 'string', 'max:255'],
            'education.*.field_of_study' => ['required', 'string', 'max:255'],
            'education.*.start_date' => ['required', 'date'],
            'education.*.end_date' => ['nullable', 'date'],
            'education.*.description' => ['nullable', 'string'],
            'education.*.is_current' => ['required', 'boolean'],
            'education.*.sort_order' => ['required', 'integer'],
            'experiences' => ['array'],
            'experiences.*.id' => ['required', 'integer'],
            'experiences.*.job_title' => ['required', 'string', 'max:255'],
            'experiences.*.company_name' => ['required', 'string', 'max:255'],
            'experiences.*.company_address' => ['required', 'string', 'max:255'],
            'experiences.*.start_date' => ['required', 'date'],
            'experiences.*.end_date' => ['nullable', 'date'],
            'experiences.*.description' => ['nullable', 'string'],
            'experiences.*.is_current' => ['required', 'boolean'],
            'experiences.*.sort_order' => ['required', 'integer'],
            'skills' => ['array'],
            'skills.*.id' => ['required', 'integer'],
            'skills.*.name' => ['required', 'string', 'max:255'],
            'skills.*.sort_order' => ['required', 'integer'],
            'languages' => ['array'],
            'languages.*.id' => ['required', 'integer'],
            'languages.*.name' => ['required', 'string', 'max:255'],
            'languages.*.language_proficiency_id' => ['required', 'integer'],
            'languages.*.sort_order' => ['required', 'integer'],
            'additions' => ['array'],
            'additions.*.id' => ['required', 'integer'],
            'additions.*.name' => ['required', 'string', 'max:255'],
            'additions.*.description' => ['nullable', 'string'],
            'additions.*.sort_order' => ['required', 'integer'],
        ];
    }
}
