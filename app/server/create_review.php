<?php
include("api.php");

if($_SERVER["REQUEST_METHOD"] == "POST"){
    $reviewsData = getReviewsData();
    $currId = generateID($reviewsData);
    $newReview = [
        "eventID" => intval(($_POST["eventID"])),
        "id" => $currId,
        "name" => $_POST["name"],
        "body" => $_POST["body"]
    ];

    $reviewsData[] = $newReview;
    file_put_contents($reviewsJSON, json_encode($reviewsData, JSON_PRETTY_PRINT));
    echo json_encode($newReview);
    exit();
}