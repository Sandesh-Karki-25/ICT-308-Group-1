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

$query = "SELECT n.id, n.folder_id, n.title, n.body, n.created_at, a.url as audio_data 
          FROM notes n 
          LEFT JOIN attachments a ON n.id = a.note_id AND a.kind = 'audio'
          WHERE n.user_id = ? ORDER BY n.updated_at DESC";
$stmt = $conn->prepare($query);
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();
$notes = $result->fetch_all(MYSQLI_ASSOC);

echo json_encode($notes);
?>