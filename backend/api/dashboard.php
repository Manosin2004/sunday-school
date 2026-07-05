<?php
require_once '../config/db.php';
header("Content-Type: application/json");
$today = date('Y-m-d');
$total = $pdo->query("SELECT COUNT(*) FROM students")->fetchColumn();
$present = $pdo->prepare("SELECT COUNT(*) FROM attendance WHERE date=? AND status='present'");
$present->execute([$today]);
$presentCount = $present->fetchColumn();
$classes = $pdo->query("SELECT COUNT(*) FROM classes")->fetchColumn();
echo json_encode([
    "total_students" => $total,
    "present_today"  => $presentCount,
    "total_classes"  => $classes,
    "date"           => $today
]);
