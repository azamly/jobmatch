<?php

namespace App\Http\Requests\Settings\JobSeeker;

use App\Models\JobSeeker\Profile\JobSeekerProfile;
use Illuminate\Foundation\Http\FormRequest;

class EditJobSeekerRequest extends FormRequest
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
            //
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
