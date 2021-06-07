const gallery = document.getElementById('gallery');
const cardInfo = document.querySelector('.card-info-container')
const modalContainer = document.querySelector('.modal-container');
const searchInput = document.getElementById('search-input');
const searchSubmit = document.getElementById('search-submit');
let displayedEmployees = [];
let searchArray = [];
let employeeData;

modalContainer.style.display = 'none';
function generateCards (data) {
    data.results.map( person => {
        const card = document.createElement('div');
        gallery.appendChild(card);
        card.insertAdjacentHTML('beforeend', `
            <div class="card">
            <div class="card-img-container">
                <img class="card-img" src="${person.picture.large}" alt="profile picture">
            </div>
            <div class="card-info-container">
                <h3 id="name" class="card-name cap">${person.name.first} ${person.name.last}</h3>
                <p class="card-text">${person.email}</p>
                <p class="card-text cap">${person.location.city}, ${person.location.state}</p>
            </div>
            </div>
        `);
        card.addEventListener('click', () => {
            generateModal(person);
        });
        displayedEmployees.push(card);
    });
}

function generateModal (person) {
    const modal = document.createElement('div');
    modalContainer.style.display = 'block';
    modalContainer.appendChild(modal);
    const fixedPhone = person.cell.replace("-", " ")
    const birthYear = person.dob.date.slice(0, 4)
    const birthMonth = person.dob.date.slice(5, 7)
    const birthDay = person.dob.date.slice(8, 10)
    modal.insertAdjacentHTML('beforeend', `
        <div class="modal">
        <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
        <div class="modal-info-container">
            <img class="modal-img" src="${person.picture.large}" alt="profile picture">
            <h3 id="name" class="modal-name cap">${person.name.first} ${person.name.last}</h3>
            <p class="modal-text">${person.email}</p>
            <p class="modal-text cap">${person.location.city}</p>
            <hr>
            <p class="modal-text">${fixedPhone}</p>
            <p class="modal-text">123 Portland Ave., ${person.location.city}, ${person.location.state} ${person.location.postcode}</p>
            <p class="modal-text">Birthday: ${birthMonth}/${birthDay}/${birthYear}</p>
        </div>
        </div>
    `);
    document.getElementById('modal-close-btn').addEventListener('click', () => {
        //console.log(e.target)
        modalContainer.style.display = 'none';
        modal.remove();
    });
}

fetch('https://randomuser.me/api/?results=12&nat=US')
    .then(response => response.json())
    .then(data => { return data
    })
    .then(generateCards)

function search () {
    searchArray = [];
    for (let i=0; i<displayedEmployees.length; i++) {
        if (searchInput.value.length !== 0 && displayedEmployees[i].children[0].childNodes[2].nextElementSibling.childNodes[1].textContent.toLowerCase().includes(searchInput.value.toLowerCase())) {
            searchArray.push(displayedEmployees[i]);
        }
    }
    if (searchArray.length > 0) {
        while (gallery.firstChild) {
            gallery.removeChild(gallery.firstChild)
        }
    } 
    else {
        searchArray = displayedEmployees;
    }
    for (let i=0; i<searchArray.length; i++) {
        gallery.appendChild(searchArray[i]);
    }
}
searchInput.addEventListener('keyup', () => {
    search();
})
