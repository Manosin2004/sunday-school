<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Content-Type: application/json");

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../config/db.php';

try {

    $d = json_decode(file_get_contents("php://input"), true);

    if (!$d || !isset($d['username']) || !isset($d['password'])) {
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "message" => "Username and password are required"
        ]);
        exit();
    }

    $stmt = $pdo->prepare(
        "SELECT * FROM users WHERE username = ? AND password = ?"
    );

    $stmt->execute([
        $d['username'],
        md5($d['password'])
    ]);

    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user) {

        echo json_encode([
            "success" => true,
            "user" => [
                "id" => $user['id'],
                "name" => $user['name'],
                "role" => $user['role']
            ]
        ]);

    } else {

        http_response_code(401);

        echo json_encode([
            "success" => false,
            "message" => "Invalid username or password"
        ]);
    }

} catch (Exception $e) {

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);
}
