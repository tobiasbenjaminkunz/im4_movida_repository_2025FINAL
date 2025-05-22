<?php
require_once __DIR__ . '/../system/config.php';
header('Content-Type: application/json; charset=UTF-8');

// Fetch all health conditions
$stmt = $pdo->query("SELECT health_condition_id, condition_name FROM health_conditions");
$conds = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($conds);
