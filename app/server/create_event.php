<?php
include("api.php");

$response = array();

if($_SERVER["REQUEST_METHOD"] == "POST"){
    $eventsArray = getEventsData();

    $eventName = htmlspecialchars($_POST["event-name-input"]);
    $eventDate = htmlspecialchars($_POST["event-date-input"]);
    $eventTime = htmlspecialchars($_POST["event-time-input"]);
    $eventVenue = htmlspecialchars($_POST["event-venue-input"]);

    $newEvent = [
        "id" => generateID($eventsArray),
        "title" =>$eventName,
        "date" =>$eventDate,
        "time" =>$eventTime,
        "venue" => $eventVenue,
        "organizer" => json_decode($_COOKIE["user"], true)["name"]
    ];


    $eventsArray[] = $newEvent;
    file_put_contents($eventsJSON, json_encode($eventsArray, JSON_PRETTY_PRINT));
    
    $response["success"] = true;
    echo json_encode($response  );
    exit();
}
