<?php
require_once __DIR__ . '/../system/config.php';
header('Content-Type: application/json; charset=UTF-8');
session_start();

// ensure logged in
if (empty($_SESSION['user_id'])) {
  http_response_code(401);
  echo json_encode(['status'=>'error','message'=>'not_logged_in']);
  exit;
}
$user_id = $_SESSION['user_id'];

$method = $_SERVER['REQUEST_METHOD'];
if ($method === 'GET') {
  // Return array of health_condition_id
  $stmt = $pdo->prepare(
    "SELECT health_condition_id 
     FROM user_has_condition 
     WHERE user_id = :uid"
  );
  $stmt->execute([':uid'=>$user_id]);
  $rows = $stmt->fetchAll(PDO::FETCH_COLUMN);
  echo json_encode($rows);

} elseif ($method === 'POST') {
  // Replace user’s conditions with the submitted list
  $data = json_decode(file_get_contents('php://input'), true);
  $new = is_array($data['conditions'] ?? null) 
         ? $data['conditions'] 
         : [];

  // transaction: delete old, insert new
  $pdo->beginTransaction();
  $pdo->prepare("DELETE FROM user_has_condition WHERE user_id=:uid")
      ->execute([':uid'=>$user_id]);
  $ins = $pdo->prepare(
    "INSERT INTO user_has_condition (user_id, health_condition_id)
     VALUES (:uid, :hc)"
  );
  foreach ($new as $hc) {
    $ins->execute([':uid'=>$user_id, ':hc'=>$hc]);
  }
  $pdo->commit();

  echo json_encode(['status'=>'success']);
  
} else {
  http_response_code(405);
  echo json_encode(['status'=>'error','message'=>'method_not_allowed']);
}
