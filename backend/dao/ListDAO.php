<?php

require_once '../config/connexion.php';

class ListDAO
{
    private $db;

    public function __construct(PDO $db)
    {
        $this->db = $db;
    }

    public function addList(int $boardId, string $name): void
    {
        $query = 'INSERT INTO lists (board_id, name) VALUES (:board_id, :name)';
        $stmt = $this->db->prepare($query);
        $stmt->execute([
            ':board_id' => $boardId,
            ':name' => $name
        ]);
    }

    public function getListsByBoardId(int $boardId): array
    {
        $query = 'SELECT * FROM lists WHERE board_id = :board_id';
        $stmt = $this->db->prepare($query);
        $stmt->execute([':board_id' => $boardId]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function deleteList(int $listId): void
    {
        $query = 'DELETE FROM lists WHERE id = :list_id';
        $stmt = $this->db->prepare($query);
        $stmt->execute([':list_id' => $listId]);
    }
}
?>