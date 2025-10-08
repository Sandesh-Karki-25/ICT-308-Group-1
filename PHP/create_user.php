<?php
include 'database.php';

$username = "CIHE20001";
$email = "testuser@example.com";
$password = "mypassword"; // plain password
$hash = password_hash($password, PASSWORD_BCRYPT); // hash it

$stmt = $conn->prepare("INSERT INTO students (username, email, password_hash) VALUES (?, ?, ?)");
$stmt->bind_param("sss", $username, $email, $hash);

if ($stmt->execute()) {
    echo "✅ User created successfully with hashed password.";
} else {
    echo "Error: " . $conn->error;
}
?>
