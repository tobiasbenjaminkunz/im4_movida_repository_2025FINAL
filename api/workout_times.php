<?php
// api/workout_times.php

require_once __DIR__ . '/../system/config.php';
require_once __DIR__ . '/schedule.php';

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
    $stmt = $pdo->prepare(
      "SELECT workout_time_id, day_of_week, time_of_day
       FROM workout_times
       WHERE user_id = :uid
       ORDER BY day_of_week, time_of_day"
    );
    $stmt->execute([':uid'=>$user_id]);
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
    exit;
}

if ($method === 'POST') {
    $dow  = $_POST['day_of_week'] ?? null;
    $time = $_POST['time']        ?? null;
    if ($dow === null || !$time) {
        http_response_code(400);
        echo json_encode(['status'=>'error','message'=>'missing_fields']);
        exit;
    }
    $pdo->prepare(
      "INSERT INTO workout_times
         (user_id, day_of_week, time_of_day)
       VALUES
         (:uid, :dow, :t)"
    )->execute([
      ':uid' => $user_id,
      ':dow' => $dow,
      ':t'   => $time
    ]);

    // Regenerate schedule
    regenerate_schedule($pdo, $user_id);

    echo json_encode(['status'=>'success']);
    exit;
}

if ($method === 'DELETE') {
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
    )->execute([':id'=>$id, ':uid'=>$user_id]);

    // Regenerate schedule
    regenerate_schedule($pdo, $user_id);

    echo json_encode(['status'=>'success']);
    exit;
}

http_response_code(405);
echo json_encode(['status'=>'error','message'=>'method_not_allowed']);
