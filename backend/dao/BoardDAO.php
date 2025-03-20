<?php

require_once '../config/connexion.php';

class BoardDAO
{
    private $db;

    public function __construct(PDO $db)
    {
        $this->db = $db;
    }

    public function addBoard(string $name, int $userId): void
    {
        $query = 'INSERT INTO boards (name, user_id) VALUES (:name, :user_id)';
        $stmt = $this->db->prepare($query);
        $stmt->execute([':name' => $name, ':user_id' => $userId]);
    }

    public function getBoardByUserId(int $userId): array
    {
        $query = 'SELECT * FROM boards WHERE user_id = :user_id';
        $stmt = $this->db->prepare($query);
        $stmt->execute([':user_id' => $userId]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function getAllBoardsByUserId(int $userId): array
    {
        $query = 'SELECT * FROM boards WHERE user_id = :user_id';
        $stmt = $this->db->prepare($query);
        $stmt->execute([':user_id' => $userId]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}
?>