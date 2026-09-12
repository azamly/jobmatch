<?php

namespace App\Http\Requests\Settings\JobSeeker;

use App\Models\JobSeeker\Profile\JobSeekerProfile;
use Illuminate\Foundation\Http\FormRequest;

class StoreCVUploadRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $user = $this->user();

        if (JobSeekerProfile::where('user_id', $user->id)->exists()) {
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
            'file' => 'required|file|mimes:pdf,docx,png,jpg,jpeg|max:5120',
        ];
    }

    public function messages(): array
    {
        return [
            'file.required' => 'Пожалуйста, загрузите файл резюме.',
            'file.mimes' => 'Файл должен быть в формате: pdf, docx, png, jpg или jpeg.',
            'file.max' => 'Размер файла не должен превышать 5 МБ.',
        ];
    }
    protected function failedAuthorization()
    {
        redirect()
            ->route('jobseeker.index')
            ->with('error', 'У вас уже есть загруженный профиль резюме.')
            ->send();
        exit; // важно завершить выполнение
    }

}
