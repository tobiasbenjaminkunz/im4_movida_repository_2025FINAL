<?php

require_once('../system/config.php');

header('Content-Type: text/plain; charset=UTF-8');

$loginInfo = $_POST['loginInfo'] ?? '';
$password = $_POST['password'] ?? '';


$stmt = $pdo->prepare("SELECT * FROM benutzer WHERE email = :loginInfo OR username = :loginInfo");
$stmt->execute([
    ':loginInfo' => $loginInfo,
  
]);
$user = $stmt->fetch();


if ($user) {
    // User exists, now check the password
    if (password_verify($password, $user['password'])) {
        echo "Login succesful";
    } else {
        echo "Wrong password";
    }


    session_start();
    $_SESSION['user_id'] = $user['ID'];
    $_SESSION['username'] = $user['username'];
    $_SESSION['email'] = $user['email'];
    $_SESSION['logged_in'] = true;

} else {
    echo "User not found";

}





