<?php

namespace App\Http\Controllers;

use App\Models\Teacher;
use App\Models\User;
use Illuminate\Http\Request;
use Hash;

class SystemController extends Controller
{
    public function healthCheck()
    {
        return response()->json([
            'success' => true,
            'message' => 'System is running properly',
            'timestamp' => now()
        ]);
    }

    public function createTeacherProfile(Request $request)
    {
        try {
            // Create user first
            $user = User::create([
                'username' => $request->username,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'role' => 'teacher',
                'status' => 'active'
            ]);

            // Create teacher
            $teacher = Teacher::create([
                'user_id' => $user->id,
                'first_name' => $request->first_name,
                'last_name' => $request->last_name,
                'email' => $request->email,
                'phone_number' => $request->phone_number,
                'subject_specialization' => $request->subject_specialization,
                'employee_id' => $request->employee_id,
                'date_of_joining' => $request->date_of_joining,
                'status' => 'active'
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Teacher created successfully',
                'data' => $teacher
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error creating teacher: ' . $e->getMessage()
            ], 500);
        }
    }

    public function getAllTeacherProfiles()
    {
        try {
            $teachers = Teacher::all();
            return response()->json([
                'success' => true,
                'data' => $teachers
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error fetching teachers: ' . $e->getMessage()
            ], 500);
        }
    }
}