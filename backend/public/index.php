<?php
session_start();
require_once '../config/connexion.php';
require_once '../dao/BoardDAO.php';
require_once '../dao/ListDAO.php';
require_once '../dao/CardDAO.php';

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$action = $_GET['action'] ?? '';

$boardDAO = new BoardDAO($db);
$listDAO = new ListDAO($db);
$cardDAO = new CardDAO($db);

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Non autorisé']);
    exit;
}

$userId = $_SESSION['user_id'];

switch ($action) {
    case 'getBoard':
        $board = $boardDAO->getBoardByUserId($userId);
        if (!$board) {
            http_response_code(404);
            echo json_encode(['error' => 'Aucun tableau trouvé']);
            break;
        }
        $lists = $listDAO->getListsByBoardId($board['id']);
        foreach ($lists as &$list) {
            $list['cards'] = $cardDAO->getCardsByListId($list['id']);
        }
        echo json_encode([
            'name' => $board['name'],
            'lists' => $lists ?: []
        ]);
        break;

    case 'addList':
        $data = json_decode(file_get_contents('php://input'), true);
        if (empty($data['name'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Le nom de la liste est requis.']);
            break;
        }
        $listDAO->addList($board['id'], $data['name']);
        echo json_encode(['name' => $data['name']]);
        break;

    case 'addCard':
        $data = json_decode(file_get_contents('php://input'), true);
        $cardDAO->addCard($data['listId'], $data['title'], $data['description']);
        echo json_encode(['title' => $data['title'], 'description' => $data['description']]);
        break;

    case 'deleteList':
        $listId = $_GET['listId'];
        $listDAO->deleteList($listId);
        echo json_encode(['success' => true]);
        break;

    case 'deleteCard':
        $cardId = $_GET['cardId'];
        $cardDAO->deleteCard($cardId);
        echo json_encode(['success' => true]);
        break;

    default:
        echo json_encode(['error' => 'Action non reconnue']);
        break;
}
?>