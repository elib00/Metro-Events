<?php
include("api.php");
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Metro Events</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">
    <link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr. net/npm/bootstrap@5.3.2/dist/js/bootstrap.min.js" integrity="sha384-BBtl+eGJRgqQAUMxJ7pMwbEyER4l1g+O15P+16Ep7Q9Q+zqX6gSbd85u4mG4QzX+" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL" crossorigin="anonymous"></script>
    <link rel='stylesheet' href='index.css'>
</head>
<body>
    <div class="main-wrapper">
        <div class="side-tab" style="flex-direction: column; gap: 10px">
            <h3>Want to organize events? Be an Organizer!</h3>
            <form action="request.php" method="post" style="width: 100%; display: flex; justify-content: center; align-items: center; padding: 10px;">
                <button type="submit" class="btn btn-success" style="width: 40%">Send Request</button>
            </form>
        </div>
        <div class="event-tab">
            <div class="top-bar" style="position: relative">
                <form action="logout.php" method="post"
                style="width: 10%; height: 40%; position: absolute; top: 30%; right: 30px">
                    <button type="submit" class="btn btn-danger" style="width: 100%; height: 100%">Logout</button>
                </form>
            </div>

            <div class="events-wrapper"><?php echo displayEvents()?></div>
        </div>
    </div>
</body>
</html>