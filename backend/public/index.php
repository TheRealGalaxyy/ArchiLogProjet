<?php
require_once '../dao/BoardDAO.php';

require_once '../config/connexion.php';

$boardDAO = new BoardDAO($db);

$boardDAO->addBoard('Mon nouveau board');

$boards = $boardDAO->getAllBoards();
echo json_encode($boards);
?>