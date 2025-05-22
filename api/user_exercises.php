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
  // List all assigned exercises with their scheduled times
  $stmt = $pdo->prepare("
    SELECT 
      ue.id,
      e.exercise_id,
      e.exercise_name,
      e.exercise_description,
      ut.day_of_week,
      ut.time
    FROM user_exercises ue
    JOIN exercises e ON ue.exercise_id = e.exercise_id
    JOIN workout_times ut ON ue.workout_time_id = ut.workout_time_id
    WHERE ue.user_id = :uid
    ORDER BY ut.day_of_week, ut.time
  ");
  $stmt->execute([':uid' => $user_id]);
  echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
  exit;
}

if ($method === 'POST') {
  // Assign a new exercise at a given workout_time
  $exercise_id     = $_POST['exercise_id']     ?? null;
  $workout_time_id = $_POST['workout_time_id'] ?? null;
  if (!$exercise_id || !$workout_time_id) {
    http_response_code(400);
    echo json_encode(['status'=>'error','message'=>'missing_fields']);
    exit;
  }
  $ins = $pdo->prepare("
    INSERT INTO user_exercises (user_id, exercise_id, workout_time_id)
    VALUES (:uid, :eid, :wid)
  ");
  $ins->execute([
    ':uid' => $user_id,
    ':eid' => $exercise_id,
    ':wid' => $workout_time_id
  ]);
  echo json_encode(['status'=>'success']);
  exit;
}

if ($method === 'DELETE') {
  // Unassign an exercise by user_exercises.id
  parse_str(file_get_contents('php://input'), $del);
  $id = $del['id'] ?? null;
  if (!$id) {
    http_response_code(400);
    echo json_encode(['status'=>'error','message'=>'missing_id']);
    exit;
  }
  $pdo->prepare("
    DELETE FROM user_exercises 
    WHERE id = :id AND user_id = :uid
  ")->execute([':id'=>$id, ':uid'=>$user_id]);
  echo json_encode(['status'=>'success']);
  exit;
}

http_response_code(405);
echo json_encode(['status'=>'error','message'=>'method_not_allowed']);
