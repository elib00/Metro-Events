<?php
include("api.php");
if($_SERVER["REQUEST_METHOD"] == "POST"){
    $response = array();

    // $postData = file_get_contents('php://input');
    // var_dump($postData);
    // parse_str($postData, $formData);

    $user = getUser(htmlspecialchars($_POST["firstname-login-input"] . " " . $_POST["lastname-login-input"]));
    if($user){
        permitLogin($user);
        setcookie("user", json_encode($user, JSON_PRETTY_PRINT), time() + 3600, "/");
        $response["success"] = true;
        $admin = getAdminData();
        if($user == $admin[0]){
            $response["admin"] = true;
        }else{
            $response["user"] = true;
        }
    }else{
        $response["success"] = false;
        $response["user_not_found"] = true;
    }
}

echo json_encode($response, true);
?>

 