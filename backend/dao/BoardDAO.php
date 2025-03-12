<?php

require_once '../config/connexion.php';

class BoardDAO
{
    private $db;

    public function __construct(PDO $db)
    {
        $this->db = $db;
    }

    public function addBoard(string $name): void
    {
        $query = 'INSERT INTO boards (name) VALUES (:name)';
        $stmt = $this->db->prepare($query);
        $stmt->execute([':name' => $name]);
    }

    public function getBoardById(int $boardId): array
    {
        $query = 'SELECT * FROM boards WHERE id = :board_id';
        $stmt = $this->db->prepare($query);
        $stmt->execute([':board_id' => $boardId]);

        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function getAllBoards(): array
    {
        $query = 'SELECT * FROM boards';
        $stmt = $this->db->query($query);

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}
?>