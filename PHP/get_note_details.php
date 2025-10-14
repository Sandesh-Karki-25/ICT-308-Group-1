<?php
session_start();
include 'database.php';

header('Content-Type: application/json');

$user_id = $_SESSION['user_id'];
$note_id = $_GET['note_id'];

$stmt = $conn->prepare("SELECT id, title, body FROM notes WHERE id = ? AND user_id = ?");
$stmt->bind_param("ii", $note_id, $user_id);
$stmt->execute();
$result = $stmt->get_result();

if ($note = $result->fetch_assoc()) {
    echo json_encode($note);
} else {
    echo json_encode(null);
}

$stmt->close();
?>