<?php

require_once '../config/connexion.php';

class CardDAO
{
    private $db;

    public function __construct(PDO $db)
    {
        $this->db = $db;
    }

    public function addCard(int $listId, string $title, string $description): void
    {
        $query = 'INSERT INTO cards (list_id, title, description) VALUES (:list_id, :title, :description)';
        $stmt = $this->db->prepare($query);
        $stmt->execute([
            ':list_id' => $listId,
            ':title' => $title,
            ':description' => $description
        ]);
    }

    public function getCardsByListId(int $listId): array
    {
        $query = 'SELECT * FROM cards WHERE list_id = :list_id';
        $stmt = $this->db->prepare($query);
        $stmt->execute([':list_id' => $listId]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function deleteCard(int $cardId): void
    {
        $query = 'DELETE FROM cards WHERE id = :card_id';
        $stmt = $this->db->prepare($query);
        $stmt->execute([':card_id' => $cardId]);
    }
}
?>