<?php
header('Content-Type: application/json; charset=UTF-8');

// TODO: Replace with real DB query joining user_exercises + exercises
$mock = [
  [
    "exercise_id" => 1,
    "exercise_name" => "Kniebeugen",
    "exercise_description" => "Stelle dich hüftbreit hin und beuge die Knie langsam ...",
  ],
  [
    "exercise_id" => 2,
    "exercise_name" => "Armkreisen",
    "exercise_description" => "Halte die Arme seitlich ausgestreckt und mache kreisende Bewegungen ...",
  ],
  [
    "exercise_id" => 3,
    "exercise_name" => "Rückenstrecker",
    "exercise_description" => "Lege dich flach auf den Bauch und hebe Oberkörper und Beine abwechselnd an ...",
  ],
];

echo json_encode($mock);
