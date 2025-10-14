<?php
session_start();
include 'database.php';

$user_id = $_SESSION['user_id'];
$folder_id = $_POST['folder_id'];
$title = $_POST['title'];
$body = $_POST['body'];

$stmt = $conn->prepare("INSERT INTO notes (user_id, folder_id, title, body) VALUES (?, ?, ?, ?)");
$stmt->bind_param("iiss", $user_id, $folder_id, $title, $body);

if ($stmt->execute()) {
    echo "✅ Note saved successfully.";
} else {
    echo "Error: " . $conn->error;
}
?>
