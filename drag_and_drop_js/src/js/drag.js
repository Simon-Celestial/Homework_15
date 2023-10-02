"use strict"
document.addEventListener('DOMContentLoaded', () => {

    const draggables = document.querySelectorAll(".task");
    const droppables = document.querySelectorAll(".tasks-items");

    draggables.forEach((task) => {
        task.addEventListener("dragstart", () => {
            task.classList.add("is-dragging");
        });
        task.addEventListener("dragend", () => {
            task.classList.remove("is-dragging");
        });
    });

    droppables.forEach((zone) => {
        zone.addEventListener("dragover", (e) => {
            e.preventDefault();
            const dropY = e.clientY;
            const curTask = document.querySelector(".is-dragging");

            const taskList = Array.from(zone.querySelectorAll(".task:not(.is-dragging)"));
            const closestTask = taskList.reduce((closest, task) => {
                const { top, height } = task.getBoundingClientRect();
                const taskCenterY = top + height / 2;

                const offset = dropY - taskCenterY;
                if (offset < 0 && offset > closest.offset) {
                    return { task, offset };
                } else {
                    return closest;
                }
            }, { task: null, offset: Number.NEGATIVE_INFINITY }).task;

            if (!closestTask) {
                zone.appendChild(curTask);
            } else {
                zone.insertBefore(curTask, closestTask);
            }
        });
    });      
});