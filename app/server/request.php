<?php
include("api.php");

$response = array();

if($_SERVER["REQUEST_METHOD"] == "POST"){
    $user = json_decode($_COOKIE["user"], true);
    $requestsArray = getRequestsData();

    foreach($requestsArray as $request){
        if($request["name"] === $user["name"]){
            $response["error"] = "redundant_request_error";
            echo json_encode($response);
            exit();
        }
    }

    $requestsArray[] = $user;
    file_put_contents($requestsJSON, json_encode($requestsArray, JSON_PRETTY_PRINT));
    $response['success'] = 'Request processed successfully';
    echo json_encode($response);
    exit();
}
