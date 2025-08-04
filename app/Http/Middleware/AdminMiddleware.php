<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class AdminMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        $user = auth('api')->user();
        
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Authentication required. Please login first.'
            ], 401);
        }
        
        if (!$user->isAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'Access denied. Only administrators can perform this action.',
                'user_role' => $user->role
            ], 403);
        }

        return $next($request);
    }
}