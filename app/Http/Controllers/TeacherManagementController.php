<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class TeacherManagementController extends Controller
{
    private $dataFile;

    public function __construct()
    {
        $this->dataFile = storage_path('app/teachers.json');
    }

    public function index(): JsonResponse
    {
        try {
            $teachers = $this->loadTeachers();
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

    public function store(Request $request): JsonResponse
    {
        try {
            $teachers = $this->loadTeachers();
            
            $newTeacher = [
                'id' => $this->generateId(),
                'username' => $request->username,
                'email' => $request->email,
                'first_name' => $request->first_name,
                'last_name' => $request->last_name,
                'phone_number' => $request->phone_number,
                'subject_specialization' => $request->subject_specialization,
                'employee_id' => $request->employee_id,
                'date_of_joining' => $request->date_of_joining,
                'status' => 'active',
                'created_at' => date('Y-m-d H:i:s')
            ];

            $teachers[] = $newTeacher;
            $this->saveTeachers($teachers);

            return response()->json([
                'success' => true,
                'message' => 'Teacher created successfully',
                'data' => $newTeacher
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error creating teacher: ' . $e->getMessage()
            ], 500);
        }
    }

    private function loadTeachers(): array
    {
        if (!file_exists($this->dataFile)) {
            return [];
        }

        $content = file_get_contents($this->dataFile);
        return json_decode($content, true) ?: [];
    }

    private function saveTeachers(array $teachers): void
    {
        $dir = dirname($this->dataFile);
        if (!is_dir($dir)) {
            mkdir($dir, 0755, true);
        }
        
        file_put_contents($this->dataFile, json_encode($teachers, JSON_PRETTY_PRINT));
    }

    private function generateId(): int
    {
        $teachers = $this->loadTeachers();
        $maxId = 0;
        foreach ($teachers as $teacher) {
            if (isset($teacher['id']) && $teacher['id'] > $maxId) {
                $maxId = $teacher['id'];
            }
        }
        return $maxId + 1;
    }
}