<?php
session_start();

if (isset($_SESSION['user_id'])) {
    echo json_encode(['loggedIn' => true, 'user' => ['id' => $_SESSION['user_id'], 'name' => $_SESSION['user_name']]]);
} else {
    echo json_encode(['loggedIn' => false]);
}
?>