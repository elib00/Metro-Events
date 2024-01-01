<?php
include("api.php");
if($_SERVER["REQUEST_METHOD"] === "POST"){
    $reviewsData = getReviewsData();

    foreach($reviewsData as $index => $review){
        if($review["id"] == $_POST["id"] && $review["eventID"] == $_POST["eventID"] && $review["name"] === $_POST["name"]){
            $response["check"] = "kasulod"; 
            unset($reviewsData[$index]);
            break;
        }
    }

    
    $temp = array();
    foreach($reviewsData as $review){
        $temp[] = $review;
    }


    file_put_contents($reviewsJSON, json_encode($temp, JSON_PRETTY_PRINT));

    $response = [
        "success" => true,
        "message" => "Review successfully deleted"
    ];

    echo json_encode($response);
}