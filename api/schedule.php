<?php
// api/schedule.php

/**
 * Regenerates user_exercises so each workout_time slot
 * has exactly one exercise chosen from the user's conditions.
 */
function regenerate_schedule(PDO $pdo, int $user_id) {
    // 1) Clear old assignments
    $pdo->prepare("DELETE FROM user_exercises WHERE user_id = ?")
        ->execute([$user_id]);

    // 2) Get all the user's health conditions
    $stmt = $pdo->prepare(
      "SELECT health_condition_id
       FROM user_has_condition
       WHERE user_id = ?"
    );
    $stmt->execute([$user_id]);
    $conds = $stmt->fetchAll(PDO::FETCH_COLUMN);
    if (empty($conds)) return;

    // 3) Get all workout_time slots
    $stmt = $pdo->prepare(
      "SELECT workout_time_id
       FROM workout_times
       WHERE user_id = ?"
    );
    $stmt->execute([$user_id]);
    $times = $stmt->fetchAll(PDO::FETCH_COLUMN);
    if (empty($times)) return;

    // 4) Fetch all exercises matching those conditions
    //    Build an IN(...) clause safely
    $placeholders = implode(',', array_fill(0, count($conds), '?'));
    $stmt = $pdo->prepare(
      "SELECT exercise_id
       FROM exercises
       WHERE health_condition_id IN ($placeholders)"
    );
    $stmt->execute($conds);
    $exs = $stmt->fetchAll(PDO::FETCH_COLUMN);
    if (empty($exs)) return;

    // 5) Prepare insert statement
    $ins = $pdo->prepare(
      "INSERT INTO user_exercises
         (user_id, exercise_id, workout_time_id)
       VALUES
         (:uid, :eid, :wid)"
    );

    // 6) For each time slot, pick one exercise at random
    foreach ($times as $wtid) {
        $eid = $exs[array_rand($exs)];
        $ins->execute([
          ':uid' => $user_id,
          ':eid' => $eid,
          ':wid' => $wtid
        ]);
    }
}
