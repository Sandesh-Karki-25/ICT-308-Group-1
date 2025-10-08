<?php
session_start();
include 'database.php';

header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    http_response_code(401); // Unauthorized
    echo json_encode(['error' => 'User not logged in']);
    exit();
}

$user_id = $_SESSION['user_id'];

// Prepare a statement to select only favourite notes for the user
$stmt = $conn->prepare(
    "SELECT n.id, n.folder_id, n.title, n.body, n.created_at, f.name as folder_name 
     FROM notes n
     LEFT JOIN folders f ON n.folder_id = f.id
     WHERE n.user_id = ? AND n.is_favourite = 1 
     ORDER BY n.created_at DESC"
);
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();
$notes = $result->fetch_all(MYSQLI_ASSOC);

echo json_encode($notes);
$stmt->close();
?>