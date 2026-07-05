<?php
require_once '../config/db.php';
header("Content-Type: application/json");
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    if (isset($_GET['class_id'])) {
        $stmt = $pdo->prepare("SELECT s.*, c.class_name FROM students s JOIN classes c ON s.class_id=c.id WHERE s.class_id=? ORDER BY s.name");
        $stmt->execute([$_GET['class_id']]);
    } else {
        $stmt = $pdo->query("SELECT s.*, c.class_name FROM students s JOIN classes c ON s.class_id=c.id ORDER BY s.name");
    }
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
} elseif ($method === 'POST') {
    $d = json_decode(file_get_contents("php://input"), true);
    $stmt = $pdo->prepare("INSERT INTO students (name, class_id, dob, phone) VALUES (?,?,?,?)");
    $stmt->execute([$d['name'], $d['class_id'], $d['dob'], $d['phone']]);
    echo json_encode(["id" => $pdo->lastInsertId(), "message" => "Student added"]);
} elseif ($method === 'PUT') {
    $d = json_decode(file_get_contents("php://input"), true);
    $stmt = $pdo->prepare("UPDATE students SET name=?, class_id=?, dob=?, phone=? WHERE id=?");
    $stmt->execute([$d['name'], $d['class_id'], $d['dob'], $d['phone'], $_GET['id']]);
    echo json_encode(["message" => "Updated"]);
} elseif ($method === 'DELETE') {
    $pdo->prepare("DELETE FROM students WHERE id=?")->execute([$_GET['id']]);
    echo json_encode(["message" => "Deleted"]);
}
