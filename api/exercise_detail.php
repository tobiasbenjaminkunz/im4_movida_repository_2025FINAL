<?php
// api/exercises.php

require_once __DIR__ . '/../system/config.php';
header('Content-Type: application/json; charset=UTF-8');
session_start();

if (empty($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['error'=>'not_logged_in']);
    exit;
}
$uid   = $_SESSION['user_id'];
$today = date('w');

try {
    $stmt = $pdo->prepare("
      SELECT
        e.exercise_id,
        e.exercise_name,
        e.exercise_description,
        ut.day_of_week,
        ut.time_of_day
      FROM user_exercises ue
      JOIN workout_times ut 
        ON ue.workout_time_id = ut.workout_time_id
      JOIN exercises e 
        ON ue.exercise_id = e.exercise_id
      WHERE ue.user_id    = :uid
        AND ut.day_of_week = :dow
      ORDER BY ut.time_of_day
    ");
    $stmt->execute([':uid'=>$uid, ':dow'=>$today]);
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
} catch (PDOException $e) {
    http_response_code(500);
    error_log("Fetch exercises error: " . $e->getMessage());
    echo json_encode(['error'=>'db_error']);
}
