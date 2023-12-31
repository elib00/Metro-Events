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


function generateOrganizerApprovalContent(data){
    const adminTab = document.getElementById("admin-approvals-tab");
    let output = ``;

    for(let i = data.length - 1; i >= 0; i--){
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
        `

        newRequestCard.innerHTML = output;
        addApproveFunctionality(newRequestCard, data[i]);
        addRejectFunctionality(newRequestCard);
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