<?php 

$reviewsJSON = "../data/reviews.json";
$usersJSON = "../data/users.json";
$adminJSON = "../data/admin.json";
$organizerRequestsJSON = "../data/organizer_requests.json";
$eventsJSON = "../data/events.json";

function getCurrentUser(){
    return json_decode($_COOKIE["user"]);
}

function getAdminData(){
    global $adminJSON;
    
    if(!file_exists($adminJSON)){
        echo "File not found";
        return [];
    }

    $data = file_get_contents($adminJSON);
    return json_decode($data, true);
}

function getReviewsData(){
    global $reviewsJSON;

    if(!file_exists($reviewsJSON)){
        echo "File not found";
        return [];
    }

    $data = file_get_contents($reviewsJSON);
    return json_decode($data, true);
}

function getOrganizerRequestsData(){
    global $organizerRequestsJSON;
    if (!file_exists($organizerRequestsJSON)) {
        echo "File not found";
        return [];
    }

    $data = file_get_contents($organizerRequestsJSON);
    return json_decode($data, true);
}

function getUsersData(){
    global $usersJSON;
    if (!file_exists($usersJSON)) {
        echo "File not found";
        return [];
    }

    $data = file_get_contents($usersJSON);
    return json_decode($data, true);
}

function getEventsData(){
    global $eventsJSON;

    if(!file_exists($eventsJSON)){
        echo "File not found";
        return [];
    }

    $data = file_get_contents($eventsJSON);
    return json_decode($data, true);
}

function getUser($username){
    $usersData = getUsersData();
    foreach($usersData as $user){
        if($user["name"] == $username){
            return $user;
        }   
    }

    $adminData = getAdminData();
    if($adminData[0]["name"] == $username){
        return $adminData[0];
    }
    
    return null;
}

function generateID($data){
    $id = 0;
    foreach($data as $elem){
        if($elem["id"] > $id){
            $id = $elem["id"];
        }
    }
    
    return $id + 1;
}

function permitLogin($user){
    setcookie("user", json_encode($user, JSON_PRETTY_PRINT), time() + 3600, "/");
}

function logoutUser(){
    unset($_COOKIE["user"]);
    setcookie('user', '', time() - 3600, '/');
}

function displayEvents(){
    $events = getEventsData();
}

//getting the organizer requests
if ($_SERVER["REQUEST_METHOD"] === "POST" && isset($_POST["action"])) {
    $action = $_POST["action"];
    if ($action === "getOrganizerRequestsData" && function_exists("getOrganizerRequestsData")) {
        $data = getOrganizerRequestsData();
        echo json_encode($data);
    } 
}

//getting the events
if ($_SERVER["REQUEST_METHOD"] === "POST" && isset($_POST["action"])) {
    $action = $_POST["action"];
    if ($action === "getEventsData" && function_exists("getEventsData")) {
        $data = getEventsData();
        echo json_encode($data);
    } 
}

//getting the reviews
if ($_SERVER["REQUEST_METHOD"] === "POST" && isset($_POST["action"])) {
    $action = $_POST["action"];
    if ($action === "getReviewsData" && function_exists("getReviewsData")) {
        $data = getReviewsData();
        echo json_encode($data);
    } 
}


//get current user data
if ($_SERVER["REQUEST_METHOD"] === "POST" && isset($_POST["action"])) {
    $action = $_POST["action"];
    if ($action === "getCurrentUser" && function_exists("getCurrentUser")) {
        $data = getCurrentUser();
        echo json_encode($data);
    } 
}

?>
