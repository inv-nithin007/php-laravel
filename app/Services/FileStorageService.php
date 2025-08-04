<?php

namespace App\Services;

class FileStorageService
{
    private $storagePath;

    public function __construct()
    {
        $this->storagePath = storage_path('app/data');
        if (!is_dir($this->storagePath)) {
            mkdir($this->storagePath, 0755, true);
        }
    }

    public function load(string $filename): array
    {
        $filepath = $this->storagePath . '/' . $filename . '.json';
        
        if (!file_exists($filepath)) {
            return [];
        }

        $content = file_get_contents($filepath);
        return json_decode($content, true) ?: [];
    }

    public function save(string $filename, array $data): bool
    {
        $filepath = $this->storagePath . '/' . $filename . '.json';
        return file_put_contents($filepath, json_encode($data, JSON_PRETTY_PRINT)) !== false;
    }

    public function generateId(string $filename): int
    {
        $data = $this->load($filename);
        $maxId = 0;
        
        foreach ($data as $item) {
            if (isset($item['id']) && $item['id'] > $maxId) {
                $maxId = $item['id'];
            }
        }
        
        return $maxId + 1;
    }

    public function create(string $filename, array $item): array
    {
        $data = $this->load($filename);
        $item['id'] = $this->generateId($filename);
        $item['created_at'] = date('Y-m-d H:i:s');
        $item['updated_at'] = date('Y-m-d H:i:s');
        
        $data[] = $item;
        $this->save($filename, $data);
        
        return $item;
    }

    public function findById(string $filename, int $id): ?array
    {
        $data = $this->load($filename);
        
        foreach ($data as $item) {
            if ($item['id'] == $id) {
                return $item;
            }
        }
        
        return null;
    }

    public function update(string $filename, int $id, array $updates): ?array
    {
        $data = $this->load($filename);
        
        foreach ($data as $index => $item) {
            if ($item['id'] == $id) {
                $data[$index] = array_merge($item, $updates);
                $data[$index]['updated_at'] = date('Y-m-d H:i:s');
                $this->save($filename, $data);
                return $data[$index];
            }
        }
        
        return null;
    }

    public function delete(string $filename, int $id): bool
    {
        $data = $this->load($filename);
        
        foreach ($data as $index => $item) {
            if ($item['id'] == $id) {
                unset($data[$index]);
                $data = array_values($data); // Reindex array
                return $this->save($filename, $data);
            }
        }
        
        return false;
    }
}