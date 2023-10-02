"use strict"

document.addEventListener('DOMContentLoaded', () => {

    const personWrapper = document.querySelector(".person-wrapper");
    // API FETCH CODE PART
    const randomUserList = () => {
        fetch(`https://randomuser.me/api/?results=10`)
            .then((response) => {
                response.json()
                    .then((data) => {
                        data.results.forEach((person) => {
                            const personImg = person.picture.large;
                            const {first: personName, last:personSurname} = person.name;
                            const personEmail = person.email;
                            const personNationality = person.nat;
                            const personPhone = person.phone;
                            const personGender = person.gender;
                            const personAge = person.dob.age;
                            const personBlock = document.createElement("div");
                            personBlock.classList.add("person")
                            personBlock.innerHTML =
                                `<img src="${personImg}" alt="person">
                        <p>First Name: ${personName}</p>
                        <p>Last Name: ${personSurname}</p>
                        <p>Gender: ${personGender}</p>
                        <p>Age: ${personAge}</p>
                        <p>Email: ${personEmail}</p>
                        <p>Nationality: ${personNationality}</p>
                        <p>Contact: ${personPhone}</p>`
                            personWrapper.appendChild(personBlock);
                        });
                    })
                    .catch((error) => {
                        alert(`Error happened: ${error.message}`)
                    });
            });
    };
    randomUserList();

    // SHOW MORE BUTTON CODE PART
    const showMoreBtn = document.querySelector(".showMoreBtn");
    let prevScrollY = 0;

    document.addEventListener("scroll", () => {
        const currentScrollY = window.scrollY;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;

        if (currentScrollY + windowHeight >= documentHeight) {
            showMoreBtn.style.visibility = "visible";
        }
        prevScrollY = currentScrollY;
    });

    showMoreBtn.addEventListener("click", () => {
        showMoreBtn.style.visibility = "hidden";
        randomUserList();
    });

    // PRELOADER CODE PART 

    const preloader = document.querySelector(".preloader");

    window.addEventListener("load", () => {
        preloader.style.display = "none"
    });
});