<?php
// app/Exceptions/Handler.php

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Validation\ValidationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\HttpKernel\Exception\MethodNotAllowedHttpException;
use Tymon\JWTAuth\Exceptions\JWTException;
use Tymon\JWTAuth\Exceptions\TokenExpiredException;
use Tymon\JWTAuth\Exceptions\TokenInvalidException;
use Throwable;

class Handler extends ExceptionHandler
{
    protected $levels = [
        //
    ];

    protected $dontReport = [
        //
    ];

    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    public function register(): void
    {
        $this->reportable(function (Throwable $e) {
            //
        });
    }

    public function render($request, Throwable $exception)
    {
        if ($request->is('api/*')) {
            
            // Handle validation errors
            if ($exception instanceof ValidationException) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $exception->errors()
                ], 422);
            }

            // Handle model not found
            if ($exception instanceof ModelNotFoundException) {
                return response()->json([
                    'success' => false,
                    'message' => 'Resource not found'
                ], 404);
            }

            // Handle 404 errors
            if ($exception instanceof NotFoundHttpException) {
                return response()->json([
                    'success' => false,
                    'message' => 'Endpoint not found'
                ], 404);
            }

            // Handle method not allowed
            if ($exception instanceof MethodNotAllowedHttpException) {
                return response()->json([
                    'success' => false,
                    'message' => 'Method not allowed'
                ], 405);
            }

            // Handle JWT token expired
            if ($exception instanceof TokenExpiredException) {
                return response()->json([
                    'success' => false,
                    'message' => 'Token has expired'
                ], 401);
            }

            // Handle JWT token invalid
            if ($exception instanceof TokenInvalidException) {
                return response()->json([
                    'success' => false,
                    'message' => 'Token is invalid'
                ], 401);
            }

            // Handle JWT exceptions
            if ($exception instanceof JWTException) {
                return response()->json([
                    'success' => false,
                    'message' => 'Token is required'
                ], 401);
            }

            // Handle general server errors
            return response()->json([
                'success' => false,
                'message' => 'Internal server error',
                'error' => config('app.debug') ? $exception->getMessage() : 'Something went wrong'
            ], 500);
        }

        return parent::render($request, $exception);
    }
}
