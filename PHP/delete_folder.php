<?php
session_start();
require_once 'database.php';

if (!isset($_SESSION['student_id'])) {
    http_response_code(403);
    exit('Not logged in');
}
if (!isset($_POST['folder_name'])) {
    http_response_code(400);
    exit('No folder name');
}

$student_id = $_SESSION['student_id'];
$folder_name = $_POST['folder_name'];

// Find folder ID
$stmt = $conn->prepare("SELECT id FROM folders WHERE user_id = ? AND name = ?");
$stmt->bind_param("is", $student_id, $folder_name);
$stmt->execute();
$stmt->bind_result($folder_id);
if ($stmt->fetch()) {
    $stmt->close();
    // Delete notes
    $conn->query("DELETE FROM notes WHERE folder_id = $folder_id");
    // Delete folder
    $conn->query("DELETE FROM folders WHERE id = $folder_id");
    echo "success";
} else {
    $stmt->close();
    echo "Folder not found";
}
?>