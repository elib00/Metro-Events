<?php
include("api.php");
if($_SERVER["REQUEST_METHOD"] == "POST"){
    $response = array();

    $pendingUser = [
        "name" => htmlspecialchars($_POST["firstname-login-input"] . " " . $_POST["lastname-login-input"]),
        "email" => htmlspecialchars($_POST["email-login-input"]),
        "password" => htmlspecialchars($_POST["password-login-input"])
    ];

    $user = getUser($pendingUser);
    if($user){
        permitLogin($user);
        setcookie("user", json_encode($user, JSON_PRETTY_PRINT), time() + 3600, "/");
        $response["success"] = true;    
        $admin = getAdminData();    
        if($user == $admin[0]){
            $response["admin"] = true;
        }else{
            if($user["isOrganizer"] == true){
                $response["organizer"] = true;
            }else{
                $response["user"] = true;
            } 
        }
    }else{
        $response["success"] = false;
        $response["user_not_found"] = true;
    }
}

echo json_encode($response);
?>

 