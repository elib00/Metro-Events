<?php
include("api.php");
if($_SERVER["REQUEST_METHOD"] == "POST"){
    $user = getUser(htmlspecialchars($_POST["firstname-login-input"] . " " . $_POST["lastname-login-input"]));
    if($user){
        permitLogin($user);
        setcookie("user", json_encode($user, JSON_PRETTY_PRINT), time() + 3600, "/");
        $admin = getAdminData();
        if($user == $admin[0]){
            header("Location: admin.php");
        }else{
            header("Location: user.php");
        }
    }else{
        header("Location: ?user_not_found");
    }

}

?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">
    <link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr. net/npm/bootstrap@5.3.2/dist/js/bootstrap.min.js" integrity="sha384-BBtl+eGJRgqQAUMxJ7pMwbEyER4l1g+O15P+16Ep7Q9Q+zqX6gSbd85u4mG4QzX+" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL" crossorigin="anonymous"></script>
    <link rel='stylesheet' href='index.css'>
</head>
<body>
    <div class="main-wrapper">
        <form style="display: flex; justify-content: center; align-items: center; width: 50%"
            action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"])?>" method="post">
            <div class="details-box">
                <h1>Login</h1>
                <div class="form-floating mb-3" style="width: 80%">
                    <input type="text" class="form-control" id="firstname-login-input" name="firstname-login-input" placeholder="">
                    <label for="name-login-input">Name</label>
                </div>
                <div class="form-floating mb-3" style="width: 80%">
                    <input type="text" class="form-control" id="lastname-login-input" name="lastname-login-input" placeholder="">
                    <label for="name-login-input">Lastname</label>
                </div>
                <div class="form-floating mb-3" style="width: 80%">
                    <input type="email" class="form-control" id="email-login-input" name="email-login-input" placeholder="">
                    <label for="email-login-input">Email</label>
                </div>
                <button type="submit" class="btn btn-success" style="width: 20%">Login</button>
            </div>
        </form>
    </div>
</body>
</html>