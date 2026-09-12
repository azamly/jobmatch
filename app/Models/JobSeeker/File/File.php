<?php

namespace App\Models\JobSeeker\File;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class File extends Model
{
    protected $fillable = [
      'file_path',
      'file_name',
      'file_size',
      'mime_type',
      'sort_order'
    ];

    public function fileable(): MorphTo
    {
        return $this->morphTo();
    }
}
