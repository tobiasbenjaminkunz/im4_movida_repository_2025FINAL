<?php
header('Content-Type: application/json; charset=UTF-8');

$id = $_GET['id'] ?? null;
if (!$id) {
  http_response_code(400);
  echo json_encode(["error" => "Keine Übungs-ID übergeben"]);
  exit;
}

// TODO: Replace with real SELECT ... WHERE exercise_id = :id
$mock = [
  "exercise_id" => (int)$id,
  "exercise_name" => "Beispiel-Übung #{$id}",
  "exercise_description" => "Beschreibung für Übung {$id} …"
];

echo json_encode($mock);
