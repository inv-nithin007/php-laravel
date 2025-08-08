<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\TeacherController;
use App\Http\Controllers\StudentController;

// Public routes - NO MIDDLEWARE REQUIRED
Route::post('/auth/login', [AuthController::class, 'login']);
Route::get('/test', function () {
    return response()->json(['message' => 'API is working!']);
});

// Protected routes - REQUIRE AUTHENTICATION
Route::middleware(['auth:api'])->group(function () {
    // Auth routes that need authentication
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me', [AuthController::class, 'me']);
    
    // Admin-only routes for user management
    Route::middleware(['admin'])->group(function () {
        // User registration - Admin only
        Route::post('/auth/register', [AuthController::class, 'register']);
        
        // Teacher management - Admin only (Create & Delete only)
        Route::post('/teachers', [TeacherController::class, 'store']);
        Route::delete('/teachers/{id}', [TeacherController::class, 'destroy']);
        
        // Student management - Admin only (Create & Delete only)
        Route::post('/students', [StudentController::class, 'store']);
        Route::delete('/students/{id}', [StudentController::class, 'destroy']);
    });
    
    // Routes accessible by authenticated users (Admin, Teachers, Students)
    Route::get('/teachers', [TeacherController::class, 'index']);
    Route::get('/students', [StudentController::class, 'index']);
    
    // Self-profile management routes (Teachers and Students only)
    Route::middleware(['role:teacher,student'])->group(function () {
        Route::get('/profile', [AuthController::class, 'getProfile']);
        Route::put('/profile', [AuthController::class, 'updateProfile']);
    });
    
    // Teacher-only routes
    Route::middleware(['role:teacher'])->group(function () {
        Route::get('/my-students', [TeacherController::class, 'getMyStudents']);
    });
    
    // Password change route (All authenticated users)
    Route::put('/change-password', [AuthController::class, 'changePassword']);
});