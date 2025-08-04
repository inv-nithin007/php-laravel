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
    public function index()
    {
        try {
            $teachers = Teacher::with('user')->get();

            return response()->json([
                'success' => true,
                'data' => $teachers
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
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
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

    public function show($id)
    {
        try {
            $teacher = Teacher::with('user')->findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => $teacher
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Teacher not found'
            ], 404);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $teacher = Teacher::findOrFail($id);

            $validator = Validator::make($request->all(), [
                'first_name' => 'sometimes|required|string|min:2|max:50',
                'last_name' => 'sometimes|required|string|min:2|max:50',
                'email' => 'sometimes|required|email|max:100|unique:users,email,' . $teacher->user_id,
                'phone_number' => 'sometimes|required|string|max:20',
                'subject_specialization' => 'sometimes|required|string|max:100',
                'employee_id' => 'sometimes|required|string|max:20|unique:teachers,employee_id,' . $id,
                'date_of_joining' => 'sometimes|required|date',
                'status' => 'sometimes|required|in:active,inactive'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            DB::beginTransaction();

            $teacher->update($request->only([
                'first_name', 'last_name', 'email', 'phone_number',
                'subject_specialization', 'employee_id', 'date_of_joining', 'status'
            ]));

            // Update user email if provided
            if ($request->has('email')) {
                $teacher->user->update(['email' => $request->email]);
            }

            DB::commit();

            $teacher->load('user');

            return response()->json([
                'success' => true,
                'message' => 'Teacher updated successfully',
                'data' => $teacher
            ]);

        } catch (\Exception $e) {
            DB::rollback();
            return response()->json([
                'success' => false,
                'message' => 'Error updating teacher: ' . $e->getMessage()
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
}