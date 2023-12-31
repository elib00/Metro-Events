<?php
include("api.php");
if($_SERVER["REQUEST_METHOD"] === "POST"){
    $organizerRequests = getOrganizerRequestsData();
    $usersData = getUsersData();

    //remove the entry from the requests
    foreach($organizerRequests as $index => $userRequest){
        if($userRequest["name"] === $_POST["name"]){
            unset($organizerRequests[$index]);
            break;
        }
    }

    //modify the users data json to make the isOrganizer value to true
    foreach($usersData as &$user){
        if($user["name"] === $_POST["name"]){
            $user["isOrganizer"] = true;
            break;
        }
    }

    file_put_contents($usersJSON, json_encode($usersData, JSON_PRETTY_PRINT));
    file_put_contents($organizerRequestsJSON, json_encode($organizerRequests, JSON_PRETTY_PRINT));

    $response = [
        "success" => true,
        "name" => $_POST["name"]
    ];


    echo json_encode($response);
}