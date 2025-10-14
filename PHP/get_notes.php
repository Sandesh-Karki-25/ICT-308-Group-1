<?php

session_start();
include 'database.php';

$user_id = $_SESSION['user_id'];
$folder_id = intval($_GET['folder_id']);
$res = $conn->query("SELECT id, title, body, created_at FROM notes WHERE user_id = $user_id AND folder_id = $folder_id ORDER BY created_at DESC");
$notes = [];
while ($row = $res->fetch_assoc()) {
    $notes[] = $row;
}
echo json_encode($notes);
?>