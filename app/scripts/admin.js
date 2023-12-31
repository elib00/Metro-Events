import { getPendingApprovals } from "./utility.js";

document.addEventListener('DOMContentLoaded', () => {
        //make ajax call for events generation heree...


        const tabs = document.querySelectorAll("[data-tab-target]");
        const contents = document.querySelectorAll("[data-tab-content]");

        tabs.forEach(tab => {
            tab.addEventListener("click", () => {
                //hide all
                contents.forEach((content) => {
                    content.classList.remove("active");
                });

                const targetElement = document.querySelector(tab.dataset.tabTarget);
                targetElement.classList.add("active");
            });
        });

        const eventTab = document.getElementById("events-choice");
        const approvalsTab = document.getElementById("approvals-choice");
        const requestsTab = document.getElementById("requests-choice");
        approvalsTab.addEventListener("click", getPendingApprovals,  {once : true});
});