export function getPendingApprovals() {
    $.ajax({
        url: "../server/api.php",
        method: "POST",
        data: {
            action: "getOrganizerRequestsData"
        },
        success: (response) => {
            response = JSON.parse(response);
            console.log(response);
            generateOrganizerApprovalContent(response);
        }
    });
}

export function getEvents() {
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
                    generateEventsContent(response, reviewsData);
                }
            });
        }
    });
}

export function getJoinRequests(){
    $.ajax({
        url: "../server/api.php",
        method: "POST",
        data: {
            action: "getJoinRequestsData"
        },
        success: (response) => {
            response = JSON.parse(response);
            console.log(response);
            generateJoinRequestsContent(response);
        }
    });
}

function generateJoinRequestsContent(joinRequestsData){
    const joinRequestsTab = document.getElementById("admin-requests-tab");
    let data = joinRequestsData;

    for(let i = data.length - 1; i >= 0; i--){
        let output = ``;
        let newJoinCard = document.createElement("div");
        newJoinCard.className = "join-card";

        output += `
            <h3>Title: ${data[i].eventTitle}</h3>
            <h4>Name: ${data[i].name}</h4>
            <h4>Email: ${data[i].email}</h4>
            <div style="display: flex; justify-content: space-around; width: 100%">
                <button data-trigger-decline class="btn btn-danger">Decline</button>
                <button data-trigger-accept class="btn btn-success">Accept</button>
            </div>
        `;

        newJoinCard.innerHTML = output;
        addAcceptJoinRequestFunctionality(newJoinCard, data[i]);
        joinRequestsTab.appendChild(newJoinCard);
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

function generateEventsContent(data, reviews){
    const eventsTab = document.getElementById("admin-events-tab");

    for(let i = data.length - 1; i >= 0; i--){
        let output = ``;
        let newEventCard = document.createElement("div");
        newEventCard.className = "event-card";
        newEventCard.setAttribute("data-event-id", data[i].id);

        output += `
            <h1>Title: ${data[i].title}</h1>
            <h3>Date: ${data[i].date}</h3>
            <h4>Time: ${data[i].time}</h4>
            <h4>Venue: ${data[i].venue}</h4>
            <h5>Organizer: ${data[i].organizer}</h5>
            <div
                class="reviews-content" style="width: 100%; height: 300px; display: flex; flex-direction: column; align-items: center;
                border: solid black 1px; border-radius: 10px; padding: 10px; overflow-y: auto; max-height: 200px; gap: 10px">
                <h6>Reviews</h6>`;
            
            for(let j = reviews.length - 1; j >= 0; j--){
                if(reviews[j].eventID === data[i].id){
                    //console.log("nasulod diri");
                    output += 
                    `<div class="review-wrapper">
                        <h3>${reviews[j].name}</h3>
                        <p>${reviews[j].body}</p>
                        <button data-review-id="${reviews[j].id}" class="btn btn-danger delete" style="position: absolute; top: 0; right: 0;">x</button>
                    </div>`;
                    addDeleteReviewFunctionality(newEventCard, reviews[j]);
                }
            }

        output += `</div>
            <div class="form-floating">
                <textarea class="form-control" placeholder=""
                    style="resize: none; height: 100px"></textarea>
                <label >Interact with the attendees...</label>
            </div>
            <div style="width: 100%; display: flex; justify-content: space-around; align-items: center">
                <button class="btn btn-warning" data-trigger-join>Join Event</button>
                <button class="btn btn-success" data-trigger-submit>Submit Review</button>
                <button class="btn btn-danger" data-trigger-cancel>Cancel Event</button>
            </div>
        `;

        newEventCard.innerHTML = output;
        addCreateReviewFunctionality(newEventCard, data[i]); 
        eventsTab.appendChild(newEventCard);
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
                        
                        output += 
                        `
                            <h3>${newReview.name}</h3>
                            <p>${newReview.body}</p>
                            <button data-review-id="${newReview.id}" class="btn btn-danger delete" style="position: absolute; top: 0; right: 0;">x</button>
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

function generateOrganizerApprovalContent(data){
    const adminTab = document.getElementById("admin-approvals-tab");

    for(let i = data.length - 1; i >= 0; i--){
        let output = ``;    
        let newRequestCard = document.createElement("div");
        newRequestCard.className = "request-card";
    
        output += `
            <h1>Name: ${data[i].name}</h1>
            <h3>Email: ${data[i].email}</h3>
            <p>Testimony: Testttt....</p>
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