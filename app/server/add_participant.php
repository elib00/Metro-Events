<?php
include("api.php");

if($_SERVER["REQUEST_METHOD"] == "POST"){
    $joinRequestsData = getJoinRequestsData();

    $eventTitle = $_POST["eventTitle"];
    $eventID = intval($_POST["eventID"]);
    $participantName = $_POST["name"];
    $participantEmail = $_POST["email"];

    $newParticipant = [
        "eventTitle" => $eventTitle,
        "eventID" => $eventID,
        "name" => $participantName,
        "email" => $participantEmail
    ];

    //removing the request from the join request json
    foreach($joinRequestsData as $index => $joinRequest){
        if($joinRequest["eventTitle"] === $eventTitle && $joinRequest["eventID"] == $eventID
        && $joinRequest["name"] === $participantName && $joinRequest["email"] === $participantEmail){
            unset($joinRequestsData[$index]);
            break;
        }
    }

    //adding the data or new participant to the participants json
    // $participantsData = getParticipantsData();
    $eventsData = getEventsData();
    foreach($eventsData as &$event){
        if($event["title"] === $eventTitle && $event["id"] == $eventID){
            if(!in_array($participantName, $event["participants"])){
                $event["participants"][] = $participantName;    
            }
            break;
        }
    }

    $participantsData[] = $newParticipant;

    file_put_contents($joinRequestsJSON, json_encode(array_values($joinRequestsData), JSON_PRETTY_PRINT));
    file_put_contents($participantsJSON, json_encode($participantsData, JSON_PRETTY_PRINT));
    file_put_contents($eventsJSON, json_encode($eventsData, JSON_PRETTY_PRINT));

    $response = [
        "success" => true
    ];


    echo json_encode($response);
}