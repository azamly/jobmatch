<?php

namespace App\Models\JobSeeker\Language;

use Illuminate\Database\Eloquent\Model;

class LanguageProficiency extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'level',
        'title'
    ];
}
