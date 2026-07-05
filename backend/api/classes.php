<?php
require_once '../config/db.php';
header("Content-Type: application/json");
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $stmt = $pdo->query("SELECT * FROM classes ORDER BY id DESC");
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
} elseif ($method === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    $stmt = $pdo->prepare("INSERT INTO classes (class_name, teacher_name) VALUES (?, ?)");
    $stmt->execute([$data['class_name'], $data['teacher_name']]);
    echo json_encode(["id" => $pdo->lastInsertId(), "message" => "Class created"]);
} elseif ($method === 'DELETE') {
    $id = $_GET['id'];
    $pdo->prepare("DELETE FROM classes WHERE id=?")->execute([$id]);
    echo json_encode(["message" => "Deleted"]);
}
