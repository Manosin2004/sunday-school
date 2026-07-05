<?php
require_once '../config/db.php';
header("Content-Type: application/json");
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    if (isset($_GET['report'])) {
        $stmt = $pdo->prepare("SELECT s.name, a.date, a.status FROM attendance a JOIN students s ON a.student_id=s.id WHERE s.class_id=? AND MONTH(a.date)=? ORDER BY a.date, s.name");
        $stmt->execute([$_GET['class_id'], $_GET['month']]);
    } else {
        $stmt = $pdo->prepare("SELECT a.*, s.name FROM attendance a JOIN students s ON a.student_id=s.id WHERE a.date=? AND s.class_id=?");
        $stmt->execute([$_GET['date'], $_GET['class_id']]);
    }
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
} elseif ($method === 'POST') {
    $records = json_decode(file_get_contents("php://input"), true);
    $stmt = $pdo->prepare("INSERT INTO attendance (student_id, date, status, notes) VALUES (?,?,?,?) ON DUPLICATE KEY UPDATE status=VALUES(status), notes=VALUES(notes)");
    foreach ($records as $r) {
        $stmt->execute([$r['student_id'], $r['date'], $r['status'], $r['notes'] ?? '']);
    }
    echo json_encode(["message" => "Attendance saved"]);
}
