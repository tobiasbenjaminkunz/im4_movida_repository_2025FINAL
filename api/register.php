<?php
// Very simple debugging output.
// In Produktion → Passwort nicht im Klartext zurücksenden,
// sondern z.B. mit password_hash() abspeichern und gar nicht echo‑n!

// immer wenn wir etwas mit der db machen, 
// brauchen wir require once
require_once('../system/config.php');

header('Content-Type: text/plain; charset=UTF-8');

// ► Daten aus $_POST abgreifen (kommen dort an, weil wir FormData benutzen)
$username = $_POST['username'] ?? '';
$email    = $_POST['email']    ?? '';
$password = $_POST['password'] ?? '';

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
$stmt = $pdo->prepare("SELECT * FROM benutzer WHERE email = :email OR username = :username");
$stmt->execute([
    ':email' => $email,
    ':username' => $username
]);
$user = $stmt->fetch();

if ($user) {

    echo "Username oder E-Mail bereits vergeben";
    exit;

} else {

    // insert new user
    $insert = $pdo->prepare("INSERT INTO benutzer (email, username, password) VALUES (:email, :user, :pass)");
    $insert->execute([
    ':email' => $email,
    ':pass'  => $hashedPassword,
    ':user' => $username
    ]);

    if ($insert) {
        echo "Registrierung erfolgreich";
    } else {
        echo "Registrierung fehlgeschlagen";
    }

    // ► Ausgeben – nur zum Test!
    // echo "PHP meldet, Daten erfolgreich empfangen.";
    // echo "Username: {$username}\n";
    // echo "E-Mail:   {$email}\n";
    // echo "Passwort: {$hashedPassword}\n";
}