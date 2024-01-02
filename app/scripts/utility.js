export function getPendingApprovals(type) {
    $.ajax({
        url: "../server/api.php",
        method: "POST",
        data: {
            action: "getOrganizerRequestsData"
        },
        success: (response) => {
            response = JSON.parse(response);
            console.log(response);
            generateOrganizerApprovalContent(type, response);
        }
    });
}

export function getEvents(type) {
    $.ajax({
        url: "../server/api.php",
        method: "POST",
        data: {
            action: "getEventsData"
        },
        success: (response) => {
            response = JSON.parse(response);
            // console.log(response);

            $.ajax({
                url: "../server/api.php",
                method: "POST",
                data: {
                    action: "getReviewsData"
                },
                success: (reviewsData) => {
                    reviewsData = JSON.parse(reviewsData);
                    // console.log(reviewsData);
                    generateEventsContent(type, response, reviewsData);
                    getApprovedJoinRequestsNotifications();
                }
            });
        }
    });
}

export function getJoinRequests(type){
    $.ajax({
        url: "../server/api.php",
        method: "POST",
        data: {
            action: "getJoinRequestsData"
        },
        success: (response) => {
            response = JSON.parse(response);
            console.log(response);
            generateJoinRequestsContent(type, response);
        }
    });
}

export function displayMyEvents(type){
    const myEventsWrapper = document.getElementById(`${type}-events-wrapper`);
    $.ajax({
        url: "../server/api.php",
        method: "POST",
        data: {
            action: "getCurrentUser"
        },
        success: (response) => {
            let currentUser = JSON.parse(response);
            
            $.ajax({
                url: "../server/api.php",
                method: "POST",
                data: {
                    action: "getEventsData"
                },
                success: (response) => {
                    let eventsData = JSON.parse(response);
                    console.log(eventsData);

                    let data = eventsData;
                    for(let i = data.length - 1; i >= 0; i--){
                        let output = ``;
                        let newMyEventCard = document.createElement("div");
                        newMyEventCard.className = "my-event-card";

                        if(data[i].organizer === currentUser.name){
                            output +=  `
                                <h5 style="text-align: center; margin: 0px">Title: ${data[i].title}</h5>
                            `

                            newMyEventCard.innerHTML = output;
                            myEventsWrapper.appendChild(newMyEventCard);
                        }
                    }
                }
            });
        }
    });
}

export function getApprovedJoinRequestsNotifications(){
    $.ajax({
        url: "../server/api.php",
        method: "POST",
        data: {
            action: "getCurrentUser"
        },
        success: (response) => {
            let currentUser = JSON.parse(response);
            console.log(currentUser);

            //get the approved requests
            $.ajax({
                url: "../server/api.php",
                method: "POST",
                data: {
                    action: "getApprovedJoinRequests"
                },
                success: (response) => {
                    let approvedJoinRequests = JSON.parse(response);
                    console.log(approvedJoinRequests);

                    for(let i = 0; i < approvedJoinRequests.length; i++){
                        if(approvedJoinRequests[i].name === currentUser.name){
                            alert(`You have been accepted for this join request: ${approvedJoinRequests[i].eventTitle}`);
                        }
                    }
                }
            });
        }
    });
}

function generateJoinRequestsContent(type, joinRequestsData){
    const joinRequestsTab = document.getElementById(`${type}-requests-tab`);
    joinRequestsTab.innerHTML = "";
    let data = joinRequestsData;

    $.ajax({
        url: "../server/api.php",
        method: "POST",
        data: {
            action: "getCurrentUser"
        },
        success: (response) => {
            let currentUser = JSON.parse(response);
            console.log(currentUser);

            for(let i = data.length - 1; i >= 0; i--){
                let output = ``;
                let newJoinCard = document.createElement("div");
                newJoinCard.className = "join-card";

                if(currentUser.name !==  data[i].name || currentUser.name === "admin admin"){
                    output += `
                        <h1 style="color:  #FFFFF0">Event: ${data[i].eventTitle}</h1>
                        <h5 style="color: #FFFFF0;">Name: ${data[i].name}</h5>
                        <h5 style="color: #FFFFF0;">Email: ${data[i].email}</h5>
                        <div style="display: flex; justify-content: space-around; width: 100%; margin-top: 20px">
                            <button data-trigger-decline class="btn btn-danger">Decline</button>
                            <button data-trigger-accept class="btn btn-success">Accept</button>
                        </div>
                    `;

                    newJoinCard.innerHTML = output;
                    addAcceptJoinRequestFunctionality(newJoinCard, data[i]);
                    addDeclineJoinRequestFunctionality(newJoinCard, data[i]);
                    joinRequestsTab.appendChild(newJoinCard);
                }
            }
        
        }
    });
}

function addDeclineJoinRequestFunctionality(element, joinRequestData) {
    element.addEventListener("click", function(event) {
        declineJoinRequest(event, joinRequestData);
    });
}

function declineJoinRequest(event, joinRequestData){
    const triggerElement = event.target;
    if(triggerElement.tagName === "BUTTON" && triggerElement.dataset.triggerDecline !== undefined){
        const parentToRemove = triggerElement.closest(".join-card");
        parentToRemove.remove();

        //add the data to the participants json
        $.ajax({
            url: "../server/add_participant.php",
            method: "POST",
            data: joinRequestData,
            success: (response) => {
                response = JSON.parse(response);
                console.log(response);
            }
        });
    }
}

function addAcceptJoinRequestFunctionality(element, joinRequestData) {
    element.addEventListener("click", function(event) {
        acceptJoinRequest(event, joinRequestData)
    });
}

function acceptJoinRequest(event, joinRequestData){
    const triggerElement = event.target;
    if(triggerElement.tagName === "BUTTON" && triggerElement.dataset.triggerAccept !== undefined){
        const parentToRemove = triggerElement.closest(".join-card");
        parentToRemove.remove();

        //add the data to the participants json
        $.ajax({
            url: "../server/add_participant.php",
            method: "POST",
            data: joinRequestData,
            success: (response) => {
                response = JSON.parse(response);
                console.log(response);
            }
        });
    }
}

function generateEventsContent(type, data, reviews){
    const eventsTab = document.getElementById(`${type}-events-tab`);

    $.ajax({
        url: "../server/api.php",
        method: "POST",
        data: {
            action: "getCurrentUser"
        },
        success: (response) => {
            const currentUser = JSON.parse(response);

            for(let i = data.length - 1; i >= 0; i--){
                let output = ``;
                let newEventCard = document.createElement("div");
                newEventCard.className = "event-card";
                newEventCard.setAttribute("data-event-id", data[i].id);
        
                output += `
                    <button data-upvote style="position: absolute; top: 20px; right: 20px;" class="btn btn-success">Upvote</button>
                    <button value="0" class="votes btn btn-success" style="position: absolute; top: 20px; right: 120px; 
                    background-color: yellow; border: solid white 1px; color: black; font-weight: bold">0</button>
                    <h1>Title: ${data[i].title}</h1>
                    <h5>Date: ${data[i].date}</h5>
                    <h5>Time: ${data[i].time}</h5>
                    <h5>Venue: ${data[i].venue}</h5>
                    <h5>Organizer: ${data[i].organizer}</h5>
                    <div
                        class="reviews-content" style="width: 100%; height: 300px; display: flex; flex-direction: column; align-items: center;
                        border: solid black 1px; border-radius: 10px; padding: 10px; overflow-y: auto; min-height: 200px; gap: 10px;
                        background-color: #CCC;">
                        <h4>Reviews</h4>`;
                    
                    for(let j = reviews.length - 1; j >= 0; j--){
                        if(reviews[j].eventID === data[i].id){
                            //console.log("nasulod diri");
                            output += 
                            `<div class="review-wrapper">`;

                            if(currentUser.name === reviews[j].name){
                                output += `<h3><span style="color: red">You</span>: ${reviews[j].name}</h3>`;
                            }else{
                                output += `<h3>${reviews[j].name}</h3>`;
                            }
                                
                            output += `
                                <p>${reviews[j].body}</p>`
                            
                                if(reviews[j].name === currentUser.name || currentUser.isAdmin){
                                    output += ` <button data-review-id="${reviews[j].id}" class="btn btn-danger delete" style="position: absolute; top: 8px; right: 8px">x</button>`;
                                }

                        output += `</div>`;
                            addDeleteReviewFunctionality(newEventCard, reviews[j]);
                        }
                    }
        
                output += `</div>
                    <div class="form-floating">
                        <textarea class="form-control" placeholder=""
                            style="resize: none; height: 100px"></textarea>
                        <label >Interact with the attendees...</label>
                    </div>
                    <div style="width: 100%; display: flex; justify-content: space-around; align-items: center">`;
                    
                    if(data[i].organizer !== currentUser.name){
                        output +=  `<button class="btn btn-warning" data-trigger-join>Join Event</button>`;
                        addJoinEventFunctionality(newEventCard, data[i], currentUser);
                    }
                       
                output += `<button class="btn btn-success" data-trigger-submit>Submit Review</button>`
                    
                if(currentUser.name === data[i].organizer || currentUser.isAdmin){
                    output += `<button class="btn btn-danger" data-trigger-cancel>Cancel Event</button>`;
                    addCancelEventFunctionality(newEventCard, data[i]);
                }
                 
                    
                output += `</div>`;
        
                newEventCard.innerHTML = output;
                addCreateReviewFunctionality(newEventCard, data[i])
                eventsTab.appendChild(newEventCard);
                addUpvoteFunctionality(newEventCard, data[i]);
            }
        }
    });
}

function addUpvoteFunctionality(element, data){
    element.addEventListener("click", function(event){
        upvoteEvent(event, data);
    });
}

function upvoteEvent(event, data){
    const triggerElement = event.target;
    if(triggerElement.tagName === "BUTTON" && triggerElement.dataset.upvote !== undefined){
        let parentElement = triggerElement.closest(".event-card");
        let upvoteElement = parentElement.querySelector(".votes");
        let voteCount = parseInt(upvoteElement.value);
        upvoteElement.value = voteCount + 1;
        upvoteElement.textContent = voteCount + 1;
    }
}

function addCancelEventFunctionality(element, data){
    element.addEventListener("click", function(event){
        cancelEvent(event, data);
    });
}

function cancelEvent(event, data){
    const triggerElement = event.target;
    if(triggerElement.tagName === "BUTTON" && triggerElement.dataset.triggerCancel !== undefined){
        let cardToRemove = triggerElement.closest(".event-card");
        cardToRemove.remove();

        $.ajax({
            url: "../server/cancel_event.php",
            method: "POST",
            data: data,
            success: (response) => {
                response = JSON.parse(response);
                console.log(response);
            }
        });
    }
}

function addJoinEventFunctionality(element, data, currentUser) {
    element.addEventListener("click", function(event){
        joinEvent(event, data, currentUser);
    });
}

function joinEvent(event, data, currentUser){
    const triggerElement = event.target;
    if(triggerElement.tagName === "BUTTON" && triggerElement.dataset.triggerJoin !== undefined){
        let obj = {
            "title": data.title,
            "eventID": data.id,
            "name": currentUser.name,
            "email": currentUser.email
        }

        $.ajax({
            url: "../server/join_event.php",
            method: "POST",
            data: obj,
            success: (response) => {
                response = JSON.parse(response);
                console.log(response);
                if(response.success){
                    alert("Join request sent successfully!");
                }else{
                    if(response.redundant_request){
                        alert("Request has already been sent. Please wait for approval.");
                    }else if(response.is_approved){
                        alert("Request has already been approved. Have fun!");
                    }
                }
              
            }
        });
    }
}


function addDeleteReviewFunctionality(element, data){
    element.addEventListener("click", function(e){
        deleteReview(e, data);
    });
}

function deleteReview(event, data){
    const triggerElement = event.target;
    if(triggerElement.tagName === "BUTTON" && triggerElement.classList.contains("delete")){
        let buttonTargetReview = parseInt(triggerElement.dataset.reviewId);

        if(buttonTargetReview === data.id){
            console.log("deleted na sha");
            let wrapperToRemove = triggerElement.closest(".review-wrapper");
            wrapperToRemove.remove();
    
            $.ajax({
                url: "../server/delete_review.php",
                method: "POST",
                data: data,
                success: (response) => {
                    response = JSON.parse(response);
                    console.log(response);
                }
            });
        }
    } 
}


function addCreateReviewFunctionality(element, data){
    element.addEventListener("click", function(event){
        createReview(event, data)
    });
}

function createReview(event, data){
    const triggerElement = event.target;
    if(triggerElement.tagName === "BUTTON" && triggerElement.dataset.triggerSubmit !== undefined){
        let parentElement = triggerElement.closest(".event-card");
        let reviewsContent = parentElement.querySelector(".reviews-content");

        let targetTextArea = parentElement.querySelector(".form-control");
        let targetTextAreaContent = targetTextArea.value;
        targetTextArea.value = "";

        $.ajax({
            url: "../server/api.php",
            method: "POST",
            data: {
                action: "getCurrentUser",
            },
            success: (currentUserData) => {
                let output = ``;
                        
                currentUserData = JSON.parse(currentUserData);
                console.log(currentUserData);

                let obj = {
                    "eventID": data.id,
                    "name": currentUserData.name,
                    "body": targetTextAreaContent
                }
                
                $.ajax({
                    url: "../server/create_review.php",
                    method: "POST",
                    data: obj,
                    success: (newReview) => {
                        newReview = JSON.parse(newReview);
                        console.log(newReview);

                        if(currentUserData.name === newReview.name){
                            output += `<h3>You: ${newReview.name}</h3>`;
                        }else{
                            output += `<h3>${newReview.name}</h3>`;
                        }

                        output += 
                        `  
                            <p>${newReview.body}</p>
                            <button data-review-id="${newReview.id}" class="btn btn-danger delete" style="position: absolute; top: 8px; right: 8px;">x</button>
                        `;

                        let dummy = document.createElement("div");
                        dummy.innerHTML = output;

                        let tempContainer = document.createElement("div");
                        tempContainer.className = "review-wrapper";
                        tempContainer.appendChild(dummy);
                        reviewsContent.appendChild(tempContainer);

                        addDeleteReviewFunctionality(dummy, newReview);
                    }
                });
                    
            }
        });
    }
}

function generateOrganizerApprovalContent(type, data){
    const adminTab = document.getElementById(`${type}-approvals-tab`);
    adminTab.innerHTML = "";

    for(let i = data.length - 1; i >= 0; i--){
        let output = ``;    
        let newRequestCard = document.createElement("div");
        newRequestCard.className = "request-card";
    
        output += `
            <h1>Name: ${data[i].name}</h1>
            <h3>Email: ${data[i].email}</h3>
            <div
                style="display: flex; justify-content: center; align-items: center; width: 100% ; gap: 10px">
                <button class="btn btn-success approve" style="flex: 1">Approve</button>
                <button class="btn btn-danger reject" style="flex: 1">Reject</button>
            </div>
        `;

        addApproveFunctionality(newRequestCard, data[i]);
        addRejectFunctionality(newRequestCard);
        newRequestCard.innerHTML = output;
        adminTab.appendChild(newRequestCard);
    }
}

function approveRequestCard(event) {
    const triggerElement = event.target;
    if(triggerElement.tagName === "BUTTON" && triggerElement.classList.contains("approve")){
        console.log("approved na sha");
        let cardToRemove = triggerElement.closest(".request-card");
        cardToRemove.remove();
    } 
}

function addApproveFunctionality(element, data){
    element.addEventListener("click", function(e) {
        approveRequestCard(e);
        data.isOrganizer = true;
        console.log(data);
        $.ajax({
            url: "../server/approve_organizer.php",
            method: "POST",
            data: data,
            success: (response) => {
                console.log(response);
            }
        });
    });

}

function rejectRequestCard(event) {
    const triggerElement = event.target;
    if(triggerElement.tagName === "BUTTON" && triggerElement.classList.contains("reject")){
        console.log("rejected na sha");
        let cardToRemove = triggerElement.closest(".request-card");
        cardToRemove.remove();
    } 
}

function addRejectFunctionality(element){
    element.addEventListener("click", rejectRequestCard);
}