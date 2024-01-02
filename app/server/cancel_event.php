<?php
include("api.php");
if($_SERVER["REQUEST_METHOD"] == "POST"){
    $eventsData = getEventsData();

    $removedEvent = null;
    //removing the event from the event json
    foreach($eventsData as $index => $event){
        if($event["id"] == $_POST["id"]){
            $removedEvent = $event;
            unset($eventsData[$index]);
            break;
        }
    }

    $removedEvent["type"] = "cancel";
    $notificationsData = getNotificationsData();
    $notificationsData[] = $removedEvent;

    //when cancelling events, also remove all the reviews from the reviews json
    $reviewsData = getReviewsData();
    foreach($reviewsData as $index => $review){
        if($review["eventID"] == $_POST["id"]){
            unset($reviewsData[$index]);
        }
    }

    //also remove the event name from the approved join requests data
    $approvedData = getApprovedJoinRequests();
    foreach($approvedData as $index => $request){
        if($request["eventID"] == $_POST["id"]){
            unset($approvedData[$index]);
        }
    }

    file_put_contents($eventsJSON, json_encode(array_values($eventsData), JSON_PRETTY_PRINT));
    file_put_contents($notificationsJSON, json_encode(array_values($notificationsData), JSON_PRETTY_PRINT));
    file_put_contents($reviewsJSON, json_encode(array_values($reviewsData), JSON_PRETTY_PRINT));
    file_put_contents($approvedJoinRequestsJSON, json_encode(array_values($approvedData), JSON_PRETTY_PRINT));
    
    echo json_encode($removedEvent);
}