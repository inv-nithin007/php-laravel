<?php

namespace App\Http\Controllers;

use App\Models\Student;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class StudentController extends Controller
{
    public function index(Request $request)
    {
        try {
            $perPage = 5;
            $page = $request->get('page', 1);
            
            $students = Student::with('user', 'assignedTeacher')
                ->paginate($perPage, ['*'], 'page', $page);

            return response()->json([
                'success' => true,
                'data' => $students->items(),
                'pagination' => [
                    'last_page' => $students->lastPage(),
                    'total' => $students->total(),
                    'from' => $students->firstItem(),
                    'to' => $students->lastItem()
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error loading students: ' . $e->getMessage()
            ], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'username' => 'required|string|min:3|max:50|unique:users',
                'email' => 'required|email|max:100|unique:users',
                'password' => 'required|string|min:6',
                'first_name' => 'required|string|min:2|max:50',
                'last_name' => 'required|string|min:2|max:50',
                'phone_number' => 'required|string|max:20',
                'roll_number' => 'required|numeric|digits_between:1,4|unique:students',
                'class_grade' => 'required|string|max:50',
                'date_of_birth' => 'required|date',
                'admission_date' => 'required|date',
                'assigned_teacher_id' => 'nullable|exists:teachers,id',
            ]);

            if ($validator->fails()) {
                // Check if it's a unique constraint violation and provide specific message
                $errors = $validator->errors();
                $message = 'Validation failed';
                
                if ($errors->has('username')) {
                    $message = 'Username already exists. Please choose a different username.';
                } elseif ($errors->has('email')) {
                    $message = 'Email already exists. Please use a different email address.';
                } elseif ($errors->has('roll_number')) {
                    $message = 'Roll number already exists. Please use a different roll number.';
                }
                
                return response()->json([
                    'success' => false,
                    'message' => $message,
                    'errors' => $errors
                ], 422);
            }

            DB::beginTransaction();

            // Create user
            $user = User::create([
                'username' => $request->username,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'role' => 'student',
                'status' => 'active'
            ]);

            // Create student
            $student = Student::create([
                'user_id' => $user->id,
                'first_name' => $request->first_name,
                'last_name' => $request->last_name,
                'email' => $request->email,
                'phone_number' => $request->phone_number,
                'roll_number' => $request->roll_number,
                'class_grade' => $request->class_grade,
                'date_of_birth' => $request->date_of_birth,
                'admission_date' => $request->admission_date,
                'assigned_teacher_id' => $request->assigned_teacher_id,
                'status' => 'active'
            ]);

            DB::commit();

            // Load student with relationships
            $student->load('user', 'assignedTeacher');

            return response()->json([
                'success' => true,
                'message' => 'Student created successfully',
                'data' => $student
            ], 201);

        } catch (\Exception $e) {
            DB::rollback();
            return response()->json([
                'success' => false,
                'message' => 'Error creating student: ' . $e->getMessage()
            ], 500);
        }
    }



    public function destroy($id)
    {
        try {
            $student = Student::findOrFail($id);
            
            DB::beginTransaction();
            
            // Delete user (will cascade delete student due to foreign key)
            $student->user->delete();
            
            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Student deleted successfully'
            ]);

        } catch (\Exception $e) {
            DB::rollback();
            return response()->json([
                'success' => false,
                'message' => 'Error deleting student: ' . $e->getMessage()
            ], 500);
        }
    }
}