<?php

namespace App\Models\Employer;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;

class EmployerView extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'employer_id',
        'user_id',
        'viewed_at',
    ];

    protected $dates = ['viewed_at'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function employer()
    {
        return $this->belongsTo(Employer::class);
    }
}


