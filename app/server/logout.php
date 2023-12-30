<?php
include("api.php");
logoutUser();

$response = [
    "success" => true
];

echo json_encode($response, true);

?>