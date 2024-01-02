<?php
include("api.php");

if($_SERVER["REQUEST_METHOD"] === "POST"){
    $newParticipant = [
        "eventTitle" => $_POST["title"],
        "eventID" => intval($_POST["eventID"]),
        "name" => $_POST["name"],
        "email" => $_POST["email"]
    ];

    $joinRequestsData = getJoinRequestsData();
    $response = [];
    
    //check if the request is already approved
    $isApproved = false;
    $approvedRequests = getApprovedJoinRequests();
    foreach($approvedRequests as $index => $request){
        if($request["eventTitle"] == $newParticipant["eventTitle"] && 
        $request["eventID"] == $newParticipant["eventID"] && 
        $request["name"] == $newParticipant["name"] &&
        $request["email"] == $newParticipant["email"]){
            $isApproved = true;
            break;
        }
    }

    if($isApproved){
        $response["success"] = false;
        $response["is_approved"] = true;
        echo json_encode($response);
        exit();
    }

    //check if the request has already been made
    $include = true;
    foreach($joinRequestsData as $joinRequest){
        if($joinRequest["eventTitle"] == $newParticipant["eventTitle"] && 
        $joinRequest["eventID"] == $newParticipant["eventID"] && 
        $joinRequest["name"] == $newParticipant["name"] &&
        $joinRequest["email"] == $newParticipant["email"]){
            $include = false;
            break;
        }
    }

    if($include){
        $joinRequestsData[] = $newParticipant;
        $newParticipant["success"] = true;
    }else{
        $newParticipant["success"] = false;
        $newParticipant["redundant_request"] = true;
    }

    file_put_contents($joinRequestsJSON, json_encode($joinRequestsData, JSON_PRETTY_PRINT));
    echo json_encode($newParticipant);
}