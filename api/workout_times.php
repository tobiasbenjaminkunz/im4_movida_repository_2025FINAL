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
$method  = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
  // List all times
  $stmt = $pdo->prepare(
    "SELECT workout_time_id, day_of_week, time 
     FROM workout_times 
     WHERE user_id = :uid
     ORDER BY day_of_week, time"
  );
  $stmt->execute([':uid'=>$user_id]);
  echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
  exit;
}

if ($method === 'POST') {
  // Add a new time
  $day  = $_POST['day_of_week'] ?? null;
  $time = $_POST['time']        ?? null;
  if ($day === null || $time === null) {
    http_response_code(400);
    echo json_encode(['status'=>'error','message'=>'missing_fields']);
    exit;
  }
  $ins = $pdo->prepare(
    "INSERT INTO workout_times (user_id, day_of_week, time)
     VALUES (:uid, :dow, :t)"
  );
  $ins->execute([
    ':uid' => $user_id,
    ':dow' => $day,
    ':t'   => $time
  ]);
  echo json_encode(['status'=>'success']);
  exit;
}

if ($method === 'DELETE') {
  // Remove a time by ID
  parse_str(file_get_contents('php://input'), $del);
  $id = $del['id'] ?? null;
  if (!$id) {
    http_response_code(400);
    echo json_encode(['status'=>'error','message'=>'missing_id']);
    exit;
  }
  $pdo->prepare(
    "DELETE FROM workout_times 
     WHERE workout_time_id = :id 
       AND user_id = :uid"
  )->execute([':id'=>$id,':uid'=>$user_id]);
  echo json_encode(['status'=>'success']);
  exit;
}

// others not allowed
http_response_code(405);
echo json_encode(['status'=>'error','message'=>'method_not_allowed']);
