<?php
require_once __DIR__ . '/../system/config.php';
header('Content-Type: application/json; charset=UTF-8');
session_start();

if (empty($_SESSION['user_id'])) {
  http_response_code(401);
  echo json_encode(['status'=>'error','message'=>'not_logged_in']);
  exit;
}
$user_id = $_SESSION['user_id'];

// GET → return current info
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
  $stmt = $pdo->prepare(
    "SELECT username, email, age 
     FROM users 
     WHERE user_id = :uid"
  );
  $stmt->execute([':uid'=>$user_id]);
  $user = $stmt->fetch(PDO::FETCH_ASSOC) ?: [];
  echo json_encode($user);
  exit;
}

// POST → update info
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $username = $_POST['username'] ?? '';
  $email    = $_POST['email']    ?? '';
  $age      = $_POST['age']      ?? null;

  // basic validation
  if (!$username || !$email) {
    http_response_code(400);
    echo json_encode(['status'=>'error','message'=>'missing_fields']);
    exit;
  }

  $stmt = $pdo->prepare(
    "UPDATE users 
     SET username = :u, email = :e, age = :a 
     WHERE user_id = :uid"
  );
  $stmt->execute([
    ':u'   => $username,
    ':e'   => $email,
    ':a'   => $age,
    ':uid' => $user_id
  ]);

  echo json_encode(['status'=>'success']);
  exit;
}

// other methods not allowed
http_response_code(405);
echo json_encode(['status'=>'error','message'=>'method_not_allowed']);
