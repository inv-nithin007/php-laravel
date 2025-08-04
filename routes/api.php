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
        
        // Teacher management - Admin only
        Route::post('/teachers', [TeacherController::class, 'store']);
        Route::put('/teachers/{id}', [TeacherController::class, 'update']);
        Route::delete('/teachers/{id}', [TeacherController::class, 'destroy']);
        
        // Student management - Admin only
        Route::post('/students', [StudentController::class, 'store']);
        Route::put('/students/{id}', [StudentController::class, 'update']);
        Route::delete('/students/{id}', [StudentController::class, 'destroy']);
    });
    
    // Routes accessible by authenticated users (Admin, Teachers, Students)
    Route::get('/teachers', [TeacherController::class, 'index']);
    Route::get('/teachers/{id}', [TeacherController::class, 'show']);
    Route::get('/students', [StudentController::class, 'index']);
    Route::get('/students/{id}', [StudentController::class, 'show']);
});