<?php
include("api.php");

if($_SERVER["REQUEST_METHOD"] == "POST"){
    $joinRequestsData = getJoinRequestsData();

    $eventTitle = $_POST["eventTitle"];
    $eventID = intval($_POST["eventID"]);
    $participantName = $_POST["name"];
    $participantEmail = $_POST["email"];

    $declinedParticipant = [
        "eventTitle" => $eventTitle,
        "eventID" => $eventID,
        "name" => $participantName,
        "email" => $participantEmail
    ];

    //remove the participant from the join requests
    foreach($joinRequestsData as $index => $joinRequest){
        if($joinRequest["eventTitle"] == $eventTitle && $joinRequest["eventID"] == $eventID
        && $joinRequest["name"] === $participantName && $joinRequest["email"] === $participantEmail){
            unset($joinRequestsData[$index]);
            break;
        }
    }

    $declined = getDeclinedJoinRequestsData();
    $declined[] = $declinedParticipant;

    file_put_contents($declinedJoinRequestsJSON, json_encode($declined, JSON_PRETTY_PRINT));
    file_put_contents($joinRequestsJSON, json_encode(array_values($joinRequestsData), JSON_PRETTY_PRINT));
    echo json_encode($declinedParticipant);
}