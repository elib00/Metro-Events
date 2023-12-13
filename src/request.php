<?php
include("api.php");
if($_SERVER["REQUEST_METHOD"] == "POST"){
    $user = json_decode($_COOKIE["user"], true);
    $requestsArray = getRequestsData();
    $requestsArray[] = $user;
    file_put_contents($requestsJSON, json_encode($requestsArray, JSON_PRETTY_PRINT));
    header("Location: user.php");
}