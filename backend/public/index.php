<?php
require_once '../config/connexion.php';
require_once '../dao/BoardDAO.php';
require_once '../dao/ListDAO.php';
require_once '../dao/CardDAO.php';

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

$action = $_GET['action'] ?? '';

$boardDAO = new BoardDAO($db);
$listDAO = new ListDAO($db);
$cardDAO = new CardDAO($db);

switch ($action) {
    case 'getBoard':
        $board = $boardDAO->getBoardById(1);
        $lists = $listDAO->getListsByBoardId(1);
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
        $listDAO->addList(1, $data['name']);
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