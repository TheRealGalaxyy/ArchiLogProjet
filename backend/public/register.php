<?php
session_start();
require_once '../config/connexion.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = $_POST['name'];
    $email = $_POST['email'];
    $password = password_hash($_POST['password'], PASSWORD_BCRYPT);

    $query = 'INSERT INTO users (name, email, password) VALUES (:name, :email, :password)';
    $stmt = $db->prepare($query);
    $stmt->execute([':name' => $name, ':email' => $email, ':password' => $password]);

    if ($stmt->rowCount() > 0) {
        $_SESSION['user_id'] = $db->lastInsertId();
        $_SESSION['user_name'] = $name;
        header('Location: ../../index.html?register=success');
        exit();
    } else {
        header('Location: ../../pages/html/register.html?register=error');
        exit();
    }
}
?>