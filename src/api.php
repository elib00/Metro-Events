<?php 

$reviewsJSON = "../data/reviews.json";
$usersJSON = "../data/users.json";
$adminJSON = "../data/admin.json";


$currentUser = null;

if(isset($_COOKIE["user"])){
    $currentUser = json_decode($_COOKIE["user"], true);
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

function getUsersData(){
    global $usersJSON;
    if (!file_exists($usersJSON)) {
        echo "File not found";
        return [];
    }

    $data = file_get_contents($usersJSON);
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
}
