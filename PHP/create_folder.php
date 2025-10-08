<?php
session_start();
include 'database.php';

if (!isset($_SESSION['user_id'])) {
    http_response_code(401); // Unauthorized
    echo "Error: You must be logged in to create a folder.";
    exit();
}

$user_id = $_SESSION['user_id'];
$folder_name = $_POST['folder_name'];

if (empty($folder_name)) {
    http_response_code(400); // Bad Request
    echo "Error: Folder name cannot be empty.";
    exit();
}

$stmt = $conn->prepare("INSERT INTO folders (user_id, name) VALUES (?, ?)");
$stmt->bind_param("is", $user_id, $folder_name);

if ($stmt->execute()) {
    echo "✅ Folder created successfully.";
} else {
    http_response_code(500); // Internal Server Error
    // Provide a more detailed error for debugging, but be cautious in production
    echo "Error creating folder: " . $conn->error;
}
$stmt->close();
?>