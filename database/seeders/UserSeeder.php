<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Teacher;
use App\Models\Student;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run()
    {
        // Create admin user
        User::create([
            'username' => 'admin',
            'email' => 'admin@school.com',
            'password' => Hash::make('admin123'),
            'role' => 'admin',
            'status' => 'active'
        ]);

        // Create a sample teacher
        $teacherUser = User::create([
            'username' => 'teacher1',
            'email' => 'teacher1@school.com',
            'password' => Hash::make('password123'),
            'role' => 'teacher',
            'status' => 'active'
        ]);

        $teacher = Teacher::create([
            'user_id' => $teacherUser->id,
            'first_name' => 'John',
            'last_name' => 'Doe',
            'email' => 'teacher1@school.com',
            'phone_number' => '1234567890',
            'subject_specialization' => 'Mathematics',
            'employee_id' => 'EMP001',
            'date_of_joining' => '2024-01-15',
            'status' => 'active'
        ]);

        // Create a sample student
        $studentUser = User::create([
            'username' => 'student1',
            'email' => 'student1@school.com',
            'password' => Hash::make('password123'),
            'role' => 'student',
            'status' => 'active'
        ]);

        Student::create([
            'user_id' => $studentUser->id,
            'first_name' => 'Jane',
            'last_name' => 'Smith',
            'email' => 'student1@school.com',
            'phone_number' => '0987654321',
            'roll_number' => 'ROLL001',
            'class_grade' => '10th Grade',
            'date_of_birth' => '2008-05-20',
            'admission_date' => '2024-01-20',
            'assigned_teacher_id' => $teacher->id,
            'status' => 'active'
        ]);
    }
}