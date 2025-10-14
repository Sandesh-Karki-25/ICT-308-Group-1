<?php
session_start();
include 'database.php';

header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['error' => 'User not logged in']);
    exit();
}

$user_id = $_SESSION['user_id'];
$note_id = intval($_POST['note_id']);

// Prepare a statement to toggle the is_favourite status (0 to 1, 1 to 0)
$stmt = $conn->prepare("UPDATE notes SET is_favourite = 1 - is_favourite WHERE id = ? AND user_id = ?");
$stmt->bind_param("ii", $note_id, $user_id);

if ($stmt->execute() && $stmt->affected_rows > 0) {
    echo json_encode(['success' => true, 'message' => 'Favourite status toggled.']);
} else {
    echo json_encode(['success' => false, 'message' => 'Could not update favourite status.']);
}
$stmt->close();
?>