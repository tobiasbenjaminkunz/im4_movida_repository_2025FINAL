<?php

session_start();

if (isset($_SESSION['user_id'])) {
    
    echo json_encode([
        'status' => 'success',
        'user_id' => $_SESSION['user_id'],
        'username' => $_SESSION['username'],
        'email' => $_SESSION['email'],
        'logged_in' => $_SESSION['logged_in']
    ]);
  
}

else {
    
    echo json_encode([
        'status' => 'error',
    ]);
    
    session_destroy();
}
