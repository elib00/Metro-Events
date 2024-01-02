import { getPendingApprovals } from "./utility.js";
import { getEvents } from "./utility.js";
import { getJoinRequests } from "./utility.js";
import { displayMyEvents } from "./utility.js";

document.addEventListener('DOMContentLoaded', () => {
        //make ajax call for events generation heree...
        getEvents("admin");
        displayMyEvents("admin");

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

        const approvalsTab = document.getElementById("approvals-choice");
        const requestsTab = document.getElementById("requests-choice");

        approvalsTab.addEventListener("click", function(){
            getPendingApprovals("admin");
        });
        
        requestsTab.addEventListener("click", function() {
            getJoinRequests("admin");
        });
});