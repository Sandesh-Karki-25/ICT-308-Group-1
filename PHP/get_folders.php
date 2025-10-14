<?php

session_start();
include 'database.php';

$user_id = $_SESSION['user_id'];
$res = $conn->query("
    SELECT f.id, f.name,
        (SELECT COUNT(*) FROM notes n WHERE n.folder_id = f.id) AS noteCount,
        (SELECT MAX(n.created_at) FROM notes n WHERE n.folder_id = f.id) AS lastModified
    FROM folders f
    WHERE f.user_id = $user_id
    ORDER BY f.created_at DESC
");
$folders = [];
while ($row = $res->fetch_assoc()) {
    $folders[] = $row;
}
echo json_encode($folders);
?>