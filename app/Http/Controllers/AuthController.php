<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'username' => 'required|string',
                'password' => 'required|string|min:6',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $credentials = $request->only('username', 'password');

            if (!$token = auth('api')->attempt($credentials)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid username or password'
                ], 401);
            }

            $user = auth('api')->user();

            return response()->json([
                'success' => true,
                'message' => 'Login successful',
                'user' => $user,
                'token' => $token
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Login failed: ' . $e->getMessage()
            ], 500);
        }
    }

    public function register(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'username' => 'required|string|min:3|max:50|unique:users',
                'email' => 'required|email|max:100|unique:users',
                'password' => 'required|string|min:6',
                'role' => 'required|in:teacher,student',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $user = User::create([
                'username' => $request->username,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'role' => $request->role,
                'status' => 'active'
            ]);

            return response()->json([
                'success' => true,
                'message' => 'User registered successfully',
                'user' => $user
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Registration failed: ' . $e->getMessage()
            ], 500);
        }
    }

    public function logout()
    {
        auth('api')->logout();
        return response()->json([
            'success' => true,
            'message' => 'Successfully logged out'
        ]);
    }

    public function me()
    {
        return response()->json([
            'success' => true,
            'user' => auth('api')->user()
        ]);
    }

    public function getProfile()
    {
        try {
            $user = auth('api')->user();
            
            if ($user->role === 'teacher') {
                $profile = $user->teacher()->with('user')->first();
            } elseif ($user->role === 'student') {
                $profile = $user->student()->with('user', 'assignedTeacher')->first();
            } else {
                $profile = $user;
            }

            return response()->json([
                'success' => true,
                'data' => $profile
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error loading profile: ' . $e->getMessage()
            ], 500);
        }
    }

    public function updateProfile(Request $request)
    {
        try {
            $user = auth('api')->user();
            
            if ($user->role === 'teacher') {
                return $this->updateTeacherProfile($request, $user);
            } elseif ($user->role === 'student') {
                return $this->updateStudentProfile($request, $user);
            } else {
                return response()->json([
                    'success' => false,
                    'message' => 'Profile updates not available for admin users'
                ], 400);
            }
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error updating profile: ' . $e->getMessage()
            ], 500);
        }
    }

    private function updateTeacherProfile(Request $request, $user)
    {
        $validator = Validator::make($request->all(), [
            'first_name' => 'sometimes|required|string|min:2|max:50',
            'last_name' => 'sometimes|required|string|min:2|max:50',
            'email' => 'sometimes|required|email|max:100|unique:users,email,' . $user->id,
            'phone_number' => 'sometimes|required|string|max:20',
            // 'subject_specialization' removed - only admin can update this
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        DB::beginTransaction();

        $teacher = $user->teacher;
        $teacher->update($request->only([
            'first_name', 'last_name', 'email', 'phone_number'
            // 'subject_specialization' removed - only admin can update this
        ]));

        if ($request->has('email')) {
            $user->update(['email' => $request->email]);
        }

        DB::commit();

        $teacher->load('user');

        return response()->json([
            'success' => true,
            'message' => 'Profile updated successfully',
            'data' => $teacher
        ]);
    }

    private function updateStudentProfile(Request $request, $user)
    {
        $validator = Validator::make($request->all(), [
            'first_name' => 'sometimes|required|string|min:2|max:50',
            'last_name' => 'sometimes|required|string|min:2|max:50',
            'email' => 'sometimes|required|email|max:100|unique:users,email,' . $user->id,
            'phone_number' => 'sometimes|required|string|max:20',
            // 'class_grade' removed - only admin can update this
            'date_of_birth' => 'sometimes|required|date',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        DB::beginTransaction();

        $student = $user->student;
        $student->update($request->only([
            'first_name', 'last_name', 'email', 'phone_number', 'date_of_birth'
            // 'class_grade' removed - only admin can update this
        ]));

        if ($request->has('email')) {
            $user->update(['email' => $request->email]);
        }

        DB::commit();

        $student->load('user', 'assignedTeacher');

        return response()->json([
            'success' => true,
            'message' => 'Profile updated successfully',
            'data' => $student
        ]);
    }

    public function changePassword(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'current_password' => 'required|string|min:6',
                'new_password' => 'required|string|min:6',
                'new_password_confirmation' => 'required|string|min:6|same:new_password',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $user = auth('api')->user();
            
            // Check if current password is correct
            if (!Hash::check($request->current_password, $user->password)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Current password is incorrect'
                ], 422);
            }

            // Update password
            $user->password = Hash::make($request->new_password);
            $user->save();

            return response()->json([
                'success' => true,
                'message' => 'Password changed successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error changing password: ' . $e->getMessage()
            ], 500);
        }
    }
}