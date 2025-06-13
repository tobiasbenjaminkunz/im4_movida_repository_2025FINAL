<?php
// api/register.php

require_once __DIR__ . '/../system/config.php';
require_once __DIR__ . '/schedule.php';

header('Content-Type: text/plain; charset=UTF-8');
session_start();

// Read inputs
$username   = trim($_POST['username']   ?? '');
$email      = trim($_POST['email']      ?? '');
$password   =           $_POST['password'] ?? '';
$conditions =           $_POST['conditions'] ?? [];
$wt_days    =           $_POST['wt_day']     ?? [];
$wt_times   =           $_POST['wt_time']    ?? [];

// Basic validation
if (!$username || !$email || strlen($password) < 8) {
    echo "Bitte alle Felder korrekt ausfüllen, Passwort ≥ 8 Zeichen.";
    exit;
}

// Duplicate check
$stmt = $pdo->prepare(
  "SELECT 1 FROM users 
   WHERE email = :e OR username = :u"
);
$stmt->execute([':e'=>$email, ':u'=>$username]);
if ($stmt->fetch()) {
    echo "Username oder E-Mail bereits vergeben.";
    exit;
}

// Insert user
$hash = password_hash($password, PASSWORD_DEFAULT);
$ins  = $pdo->prepare(
  "INSERT INTO users
     (email, username, password_hash, created_at)
   VALUES
     (:e, :u, :p, NOW())"
);
$ins->execute([
  ':e' => $email,
  ':u' => $username,
  ':p' => $hash
]);
$user_id = $pdo->lastInsertId();
$_SESSION['user_id'] = $user_id;

// Link health conditions
if (!empty($conditions) && is_array($conditions)) {
    $linkHC = $pdo->prepare(
      "INSERT INTO user_has_condition
         (user_id, health_condition_id)
       VALUES
         (:uid, :hc)"
    );
    foreach ($conditions as $hc) {
        $linkHC->execute([
          ':uid' => $user_id,
          ':hc'  => $hc
        ]);
    }
}

// Link workout times
if (!empty($wt_days) && is_array($wt_days)) {
    $linkWT = $pdo->prepare(
      "INSERT INTO workout_times
         (user_id, day_of_week, time_of_day)
       VALUES
         (:uid, :dow, :t)"
    );
    foreach ($wt_days as $i => $dow) {
        $time = $wt_times[$i] ?? null;
        if ($time) {
            $linkWT->execute([
              ':uid' => $user_id,
              ':dow' => $dow,
              ':t'   => $time
            ]);
        }
    }
}

// Regenerate the exercise schedule
regenerate_schedule($pdo, $user_id);

echo "Registrierung erfolgreich";
