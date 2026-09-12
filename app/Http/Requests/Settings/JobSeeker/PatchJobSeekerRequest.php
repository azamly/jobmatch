<?php

namespace App\Http\Requests\Settings\JobSeeker;

use App\Models\JobSeeker\Profile\JobSeekerProfile;
use Illuminate\Foundation\Http\FormRequest;

class PatchJobSeekerRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $user = $this->user();

        if (!JobSeekerProfile::where('user_id', $user->id)->exists()) {
            return false;
        }

        return $user->hasRole('jobseeker');
    }
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            // Profile fields
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'middle_name' => ['nullable', 'string', 'max:255'],
            'birth_date' => ['nullable', 'date_format:Y-m-d'],
            'gender' => ['required', 'string', 'in:male,female,unspecified'],
            'address' => ['nullable', 'string', 'max:255'],
            'summary' => ['nullable', 'string'],
            'location' => ['nullable', 'string', 'max:255'],
            'industry_id' => ['nullable', 'integer', 'max:255'],

            'education' => ['array'],
            'education.*.institution' => ['required', 'string', 'max:255'],
            'education.*.degree' => ['required', 'string', 'max:255'],
            'education.*.field_of_study' => ['required', 'string', 'max:255'],
            'education.*.start_year' => ['required', 'string'],
            'education.*.end_year' => ['nullable', 'string'],
            'education.*.description' => ['nullable', 'string'],

            'experiences' => ['array'],
            'experiences.*.job_title' => ['required', 'string', 'max:255'],
            'experiences.*.company_name' => ['required', 'string', 'max:255'],
            'experiences.*.company_address' => ['nullable', 'string', 'max:255'],
            'experiences.*.start_date' => ['required', 'date'],
            'experiences.*.end_date' => ['nullable', 'date'],
            'experiences.*.description' => ['nullable', 'string'],

            'skills' => ['array'],
            'skills.*.name' => ['required', 'string', 'max:255'],
            'skills.*.sort_order' => ['required', 'integer'],

            'languages' => ['array'],
            'languages.*.name' => ['required', 'string', 'max:255'],
            'languages.*.language_proficiency_id' => ['required', 'integer','exists:language_proficiencies,id'],

            'additions' => ['array'],
            'additions.*.title' => ['required', 'string', 'max:255'],
            'additions.*.description' => ['nullable', 'string'],
            'additions.*.addition_category_id' => ['required', 'integer'],

            'links' => ['array'],
            'links.*.url' => ['required', 'string', 'max:255'],
            'links.*.type' => ['required', 'string', 'max:255'],

        ];
    }

    protected function failedAuthorization()
    {
        redirect()
            ->route('jobseeker.index')
            ->with('error', 'У вас уже есть загруженный профиль резюме.')
            ->send();
        exit;
    }
}
