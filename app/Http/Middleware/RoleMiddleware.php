<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class RoleMiddleware
{
    public function handle(Request $request, Closure $next, ...$roles)
    {
        $user = auth('api')->user();
        
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Authentication required. Please login first.'
            ], 401);
        }

        $userRole = $user->role;
        
        if (!in_array($userRole, $roles)) {
            return response()->json([
                'success' => false,
                'message' => 'Access denied. Required roles: ' . implode(', ', $roles)
            ], 403);
        }

        return $next($request);
    }
}