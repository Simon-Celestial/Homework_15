"use strict";

document.addEventListener('DOMContentLoaded', () => {

    const input = document.getElementById("input");
    const addBtn = document.getElementById("addBtn");
    const inputClear = document.getElementById("inputClear");
    const tasksItems = document.querySelector(".tasks-items");

    const addTask = () => {
        if (input.value.trim() !== "") {
            let taskRemover = document.createElement("i");
            taskRemover.classList.add("fa-solid", "fa-circle-xmark");
            let task = document.createElement("p");
            // task.setAttribute ("draggable","true");
            task.textContent = input.value;
            task.appendChild(taskRemover);
            tasksItems.appendChild(task);

            taskRemover.addEventListener("click", () => {
                task.remove();
            });

            input.value = "";
        } else {
            alert("You can't add an empty task!");
        }
    };

    addBtn.addEventListener("click", () => {
        addTask();
    });

    input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            addTask();
        }
    });

    inputClear.addEventListener("click", () => {
        input.value = "";
    });
});
