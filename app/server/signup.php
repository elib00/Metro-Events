<?php
include("api.php");
if($_SERVER["REQUEST_METHOD"] == "POST"){
    $name = htmlspecialchars($_POST["firstname-signup-input"] . " " . $_POST["lastname-signup-input"]);
    $email = htmlspecialchars($_POST["email-signup-input"]);
    $password = htmlspecialchars($_POST["password-signup-input"]);

    $usersArray = getUsersData();
    $newUser = [
        "id" => generateID($usersArray),
        "name" => $name,
        "email" => $email,
        "password" => $password,
        "isOrganizer" => false,
        "isAdmin" => false
    ];

    $userExists = getUser($newUser);
    if(!($userExists)){

        $usersArray[] = $newUser;
        setcookie("user", json_encode($newUser, JSON_PRETTY_PRINT), time() + 3600, "/");
        file_put_contents($usersJSON, json_encode($usersArray, JSON_PRETTY_PRINT));
        $newUser["success"] = true;
    }else{
        $newUser["success"] = false;
    }

    echo json_encode($newUser);
}