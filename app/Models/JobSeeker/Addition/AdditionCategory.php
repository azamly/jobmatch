<?php

namespace App\Models\JobSeeker\Addition;

use Illuminate\Database\Eloquent\Model;

class AdditionCategory extends Model
{
    public $timestamps = false;

    protected $fillable = ['name','slug'];
}
