<?php
require_once('../system/config.php');
header('Content-Type: text/plain; charset=UTF-8');

// ► Daten aus $_POST abgreifen
$username   = $_POST['username'] ?? '';
$email      = $_POST['email']    ?? '';
$password   = $_POST['password'] ?? '';
$conditions = $_POST['conditions'] ?? [];  // array of IDs

// check if fields are filled
if (empty($username) || empty($email) || empty($password)) {
    echo "Bitte fülle alle Felder aus";
    exit;
}

// check if password is at least 8 characters long
if (strlen($password) < 8) {
    echo "Passwort muss mindestens 8 Zeichen lang sein";
    exit;
}

$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

// check if user already exists
$stmt = $pdo->prepare("SELECT * FROM users WHERE email = :email OR username = :username");
$stmt->execute([
    ':email'    => $email,
    ':username' => $username
]);
$user = $stmt->fetch();

if ($user) {
    echo "Username oder E-Mail bereits vergeben";
    exit;
}

// insert new user
$insert = $pdo->prepare(
    "INSERT INTO users (email, username, password_hash, created_at, age) 
     VALUES (:email, :username, :pass, NOW(), NULL)"
);
$insert->execute([
    ':email'    => $email,
    ':username' => $username,
    ':pass'     => $hashedPassword
]);

if ($insert) {
    // get new user_id
    session_start();
    $user_id = $pdo->lastInsertId();
    $_SESSION['user_id'] = $user_id;

    // insert health conditions
    if (is_array($conditions)) {
        $link = $pdo->prepare(
            "INSERT INTO user_has_condition (user_id, health_condition_id)
             VALUES (:uid, :hc)"
        );
        foreach ($conditions as $hc_id) {
            $link->execute([
                ':uid' => $user_id,
                ':hc'  => $hc_id
            ]);
        }
    }

    echo "Registrierung erfolgreich";
} else {
    echo "Registrierung fehlgeschlagen";
}
