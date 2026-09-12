<?php

namespace App\Http\Requests\Settings\Employer;

use App\Models\Employer\Employer;
use Illuminate\Foundation\Http\FormRequest;

class PatchEmployerRequest extends FormRequest
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
            'company_name' => ['required', 'string','max:255'],
            'company_address' => ['nullable', 'string','max:255'],
            'company_website' => ['nullable', 'string','max:255'],
            'company_description' => ['nullable', 'string','max:255'],
            'contact_phone' => ['nullable', 'string','max:255'],
            'contact_email' => ['nullable', 'string','max:255'],
        ];
    }
}
