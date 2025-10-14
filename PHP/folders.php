<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type");

include_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();

// For demo purposes, using user_id = 1
// In real app, you'd get this from session
$user_id = 1;

// Get all folders for user
if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    $query = "SELECT * FROM folders WHERE user_id = :user_id ORDER BY created_at DESC";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':user_id', $user_id);
    $stmt->execute();
    
    $folders = array();
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        // Count notes in each folder
        $count_query = "SELECT COUNT(*) as note_count FROM notes WHERE folder_id = :folder_id";
        $count_stmt = $db->prepare($count_query);
        $count_stmt->bindParam(':folder_id', $row['id']);
        $count_stmt->execute();
        $count_row = $count_stmt->fetch(PDO::FETCH_ASSOC);
        
        $folders[] = array(
            'id' => $row['id'],
            'name' => $row['name'],
            'note_count' => $count_row['note_count'],
            'created_at' => $row['created_at']
        );
    }
    
    echo json_encode($folders);
}

// Create new folder
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $data = json_decode(file_get_contents("php://input"));
    
    if (!empty($data->name)) {
        $query = "INSERT INTO folders (user_id, name) VALUES (:user_id, :name)";
        $stmt = $db->prepare($query);
        $stmt->bindParam(':user_id', $user_id);
        $stmt->bindParam(':name', $data->name);
        
        if ($stmt->execute()) {
            $folder_id = $db->lastInsertId();
            echo json_encode(array(
                "message" => "Folder created successfully",
                "folder_id" => $folder_id,
                "name" => $data->name,
                "note_count" => 0
            ));
        } else {
            echo json_encode(array("message" => "Unable to create folder"));
        }
    }
}

// Delete folder
if ($_SERVER['REQUEST_METHOD'] == 'DELETE') {
    $data = json_decode(file_get_contents("php://input"));
    
    if (!empty($data->folder_id)) {
        // First delete all notes in the folder
        $delete_notes_query = "DELETE FROM notes WHERE folder_id = :folder_id";
        $delete_notes_stmt = $db->prepare($delete_notes_query);
        $delete_notes_stmt->bindParam(':folder_id', $data->folder_id);
        $delete_notes_stmt->execute();
        
        // Then delete the folder
        $query = "DELETE FROM folders WHERE id = :folder_id AND user_id = :user_id";
        $stmt = $db->prepare($query);
        $stmt->bindParam(':folder_id', $data->folder_id);
        $stmt->bindParam(':user_id', $user_id);
        
        if ($stmt->execute()) {
            echo json_encode(array("message" => "Folder deleted successfully"));
        } else {
            echo json_encode(array("message" => "Unable to delete folder"));
        }
    }
}
?>