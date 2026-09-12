<?php

namespace App\Http\Requests\Settings\Employer;

use App\Models\Employer\Employer;
use App\Models\JobSeeker\Profile\JobSeekerProfile;
use Illuminate\Foundation\Http\FormRequest;

class EditEmployerRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $user = $this->user();

        return $user->hasRole('employer');
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
