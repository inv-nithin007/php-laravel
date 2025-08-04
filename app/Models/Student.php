<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'first_name',
        'last_name',
        'email',
        'phone_number',
        'roll_number',
        'class_grade',
        'date_of_birth',
        'admission_date',
        'status',
        'assigned_teacher_id'
    ];

    protected $casts = [
        'date_of_birth' => 'date',
        'admission_date' => 'date',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function assignedTeacher()
    {
        return $this->belongsTo(Teacher::class, 'assigned_teacher_id');
    }

    public function getFullNameAttribute()
    {
        return $this->first_name . ' ' . $this->last_name;
    }
}