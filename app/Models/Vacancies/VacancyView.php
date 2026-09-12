<?php

namespace App\Models\Vacancies;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;

class VacancyView extends Model
{
    public $timestamps = false;
    protected $fillable = [
        'vacancy_id',
        'user_id',
        'viewed_at'
    ];

    protected $dates = ['viewed_at'];

    public function user(){
        return $this->belongsTo(User::class);
    }

    public function vacancy(){
        return $this->belongsTo(Vacancy::class);
    }
}
