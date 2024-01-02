import { getEvents } from "./utility.js";
import { getJoinRequests } from "./utility.js";
import { displayMyEvents } from "./utility.js";

document.addEventListener("DOMContentLoaded", function(){
    getEvents("organizer");
    displayMyEvents("organizer");

    const tabs = document.querySelectorAll("[data-tab-target]");
    const contents = document.querySelectorAll("[data-tab-content]");

    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            const targetElement = document.querySelector(tab.dataset.tabTarget);
            //hide all
            contents.forEach((content) => {
                content.classList.remove("active");
            });

            tabs.forEach((tab) => {
                tab.classList.remove("active");
            });

          
            targetElement.classList.add("active");
            tab.classList.add("active");
        });
    });

    const requestsTab = document.getElementById("organizer-requests-choice");

    requestsTab.addEventListener("click", function() {
        getJoinRequests("organizer");
    });

});