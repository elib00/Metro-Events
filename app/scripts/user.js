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
                }
            },
            error:  (status, error) => {
                console.error(status + ": " + error);
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
                        window.location.href = "../client/index.html";
                    }
                }else{
                    if(response.user_not_found){
                        window.location.href = "../client/login.html";
                    }else if(response.user_still_active){
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

   
    
});
