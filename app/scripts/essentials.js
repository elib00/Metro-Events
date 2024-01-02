document.addEventListener('DOMContentLoaded', () => {
    //sending a request to the admin
    $("#send-request-btn").on("click", function() {
        $.ajax({
            url: "../server/request.php",
            method: "POST",
            success: function(response) {
                console.log(response);
                let error = `<div id="request-error" class="alert alert-danger" role="alert">Request has already been sent!</div>`;
                let message = JSON.parse(response);
                if (message.error) {
                    $('#request-error-wrapper').html(error);
                    setTimeout(() => {
                        let requestError = document.getElementById("request-error");
                        if(requestError){
                            requestError.style.display = "none";
                        }
                    }, 2000);
                }else{
                    alert("Request to be an Organizer sent successfully!");
                }
            },
            error:  (status, error) => {
                console.error(status + ": " + error);
            }
        });
    });

    //signing up
    $("#signup-form").on("submit", function(event) {
        event.preventDefault();
        let formData = $(this).serialize();
        $.ajax({
            url: "../server/signup.php",
            method: "POST",
            data: formData,
            success: (response) => {
                response = JSON.parse(response);
                console.log(response);
                if(response.success){
                    alert("Account created successfully!");
                    window.location.href = "../client/user.html";
                }else{
                    alert("Account already exists!");
                    window.location.href = "../client/signup.html";
                }
            }
        });
    });

    //loggin in
    $("#login-form").on("submit", function(e){
        e.preventDefault();
        let formData = $(this).serialize();
        $.ajax({
            url: "../server/login.php",
            method: "POST", 
            data: formData,
            success: (response) => {
                console.log(response);
                response = JSON.parse(response);
                if(response.success){
                    if(response.admin){
                        window.location.href = "../client/admin.html";
                    }else if(response.user){
                        window.location.href = "../client/user.html";
                    }else if(response.organizer){   
                        window.location.href = "../client/organizer.html";
                    }
                }else{
                    if(response.user_not_found){
                        alert("Please use a valid account.");
                        window.location.href = "../client/login.html";
                    }else if(response.user_still_active){
                        alert("User is still active. Plese logout first.");
                        window.location.href = "../client/index.html";  
                    }
                }
            }
        });
    });

    //logging out
    $("#logout-btn").on("click", () => {
        console.log("logged out");
        $.ajax({
            url: "../server/logout.php",
            method: "POST",
            success: (response) => {
                response = JSON.parse(response);
                if(response.success) {
                    window.location.href = "../client/login.html";
                }
            }
        });
    });

    //creating an event
    $("#create-event-form").on("submit", function(e){
        e.preventDefault();
        let formData = $(this).serialize();
        $.ajax({
            url: "../server/create_event.php",
            method: "POST",
            data: formData,
            success: (response) => {
                console.log(response);
                window.location.reload();   
            }
        });
    });

    $("#admin-create-event-form").on("submit", function(e){
        e.preventDefault();
        let formData = $(this).serialize();
        $.ajax({
            url: "../server/create_event.php",
            method: "POST",
            data: formData,
            success: (response) => {
                console.log(response);
                window.location.reload();   
            }
        });
    });
   
    
});
