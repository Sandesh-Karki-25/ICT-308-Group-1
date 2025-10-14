<?php
session_start();
include 'database.php';

$user_id = $_SESSION['user_id'];
$note_id = $_POST['note_id'];
$title = $_POST['title'];
$body = $_POST['body'];

$stmt = $conn->prepare("UPDATE notes SET title = ?, body = ? WHERE id = ? AND user_id = ?");
$stmt->bind_param("ssii", $title, $body, $note_id, $user_id);

if ($stmt->execute()) {
    echo "✅ Note updated successfully.";
} else {
    echo "Error: " . $conn->error;
}
?>