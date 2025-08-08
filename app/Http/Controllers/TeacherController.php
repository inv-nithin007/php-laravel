<?php

namespace App\Http\Controllers;

use App\Models\Teacher;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class TeacherController extends Controller
{
    public function index(Request $request)
    {
        try {
            $perPage = 5; // Fixed at 5 teachers per page
            $page = $request->get('page', 1);
            
            $teachers = Teacher::with('user')
                ->paginate($perPage, ['*'], 'page', $page);

            return response()->json([
                'success' => true,
                'data' => $teachers->items(),
                'pagination' => [
                    'last_page' => $teachers->lastPage(),
                    'total' => $teachers->total(),
                    'from' => $teachers->firstItem(),
                    'to' => $teachers->lastItem()
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error loading teachers: ' . $e->getMessage()
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
                'subject_specialization' => 'required|string|max:100',
                'employee_id' => 'required|string|max:20|unique:teachers',
                'date_of_joining' => 'required|date',
            ]);

            if ($validator->fails()) {
                // Check if it's a unique constraint violation and provide specific message
                $errors = $validator->errors();
                $message = 'Validation failed';
                
                if ($errors->has('username')) {
                    $message = 'Username already exists. Please choose a different username.';
                } elseif ($errors->has('email')) {
                    $message = 'Email already exists. Please use a different email address.';
                } elseif ($errors->has('employee_id')) {
                    $message = 'Employee ID already exists. Please use a different employee ID.';
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

            DB::commit();

            // Load teacher with user relationship
            $teacher->load('user');

            return response()->json([
                'success' => true,
                'message' => 'Teacher created successfully',
                'data' => $teacher
            ], 201);

        } catch (\Exception $e) {
            DB::rollback();
            return response()->json([
                'success' => false,
                'message' => 'Error creating teacher: ' . $e->getMessage()
            ], 500);
        }
    }


    public function destroy($id)
    {
        try {
            $teacher = Teacher::findOrFail($id);
            
            DB::beginTransaction();
            
            // Delete user (will cascade delete teacher due to foreign key)
            $teacher->user->delete();
            
            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Teacher deleted successfully'
            ]);

        } catch (\Exception $e) {
            DB::rollback();
            return response()->json([
                'success' => false,
                'message' => 'Error deleting teacher: ' . $e->getMessage()
            ], 500);
        }
    }

    public function getMyStudents()
    {
        try {
            $user = auth()->user();
            $teacher = Teacher::where('user_id', $user->id)->first();
            
            if (!$teacher) {
                return response()->json([
                    'success' => false,
                    'message' => 'Teacher profile not found'
                ], 404);
            }

            $students = $teacher->students()->with('user')->get();

            return response()->json([
                'success' => true,
                'data' => $students
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error loading students: ' . $e->getMessage()
            ], 500);
        }
    }
}