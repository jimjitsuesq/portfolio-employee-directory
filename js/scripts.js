const gallery = document.getElementById('gallery');
const cardInfo = document.querySelector('.card-info-container');
const modalDiv = document.querySelector('.modal');
const modalContainer = document.querySelector('.modal-container');
const modalPrev = document.getElementById('modal-prev');
const modalNext = document.getElementById('modal-next');
const searchInput = document.getElementById('search-input');
const searchSubmit = document.getElementById('search-submit');
const employeeCards = [];
const employeeModals = [];
let currentCardId;

modalContainer.style.display = 'none';
searchSubmit.style.display = 'none';

async function fetchEmployeeData () {
    const response = await fetch('https://randomuser.me/api/?results=12&nat=US&noinfo')
    await response.json()
    .then((result) => {
        generateHTML(result)
    })
}
fetchEmployeeData();

function generateHTML (data) {
    data.results.map( (person, index) => {
        const card = document.createElement('div');
        card.insertAdjacentHTML('beforeend', `
            <div class="card" id= ${index}>
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
        employeeCards.push(card);
    });
    data.results.map( (person) => {
        const fixedPhone = person.cell.replace("-", " ");
        const birthYear = person.dob.date.slice(0, 4);
        const birthMonth = person.dob.date.slice(5, 7);
        const birthDay = person.dob.date.slice(8, 10);
        let html = 
            `<img class="modal-img" src="${person.picture.large}" alt="profile picture">
            <h3 id="name" class="modal-name cap">${person.name.first} ${person.name.last}</h3>
            <p class="modal-text">${person.email}</p>
            <p class="modal-text cap">${person.location.city}</p>
            <hr>
            <p class="modal-text">${fixedPhone}</p>
            <p class="modal-text">123 Portland Ave., ${person.location.city}, ${person.location.state} ${person.location.postcode}</p>
            <p class="modal-text">Birthday: ${birthMonth}/${birthDay}/${birthYear}</p>`;
        employeeModals.push(html);
    });
    displayemployeeCards();
}

function displayemployeeCards () {
    for (let i=0; i<employeeCards.length; i++) {
        gallery.appendChild(employeeCards[i]);
        employeeCards[i].addEventListener('click', (e) => {
            cardClickedId = e.target.closest('.card').id;
            displayModal(cardClickedId);
            e.stopPropagation;   
        });
    }
}

function displayModal (cardClickedId) {
    const currentCards = [...(document.getElementsByClassName('card'))];
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const modal = document.createElement('div');
    modal.id = cardClickedId;
    modalContainer.style.display = 'block';
    modal.className = ('modal-info-container');
    modal.innerHTML = employeeModals[cardClickedId];
    modalDiv.insertAdjacentElement('beforeend', modal);
    modalCloseBtn.addEventListener('click', closeModal);
    let currentCardIndex = currentCards.findIndex(item => item.id === cardClickedId);
    modalBrowse(currentCardIndex);
}

function modalBrowse (currentCardIndex) {
    const modalInfoContainer = document.querySelector('.modal-info-container');
    const currentCards = [...(document.getElementsByClassName('card'))];
    const currentCardsIds = [];
    currentCards.forEach(item => currentCardsIds.push(item.id));
    const currentModals = [];
    currentCardsIds.forEach(item => currentModals.push(employeeModals[item]));
    modalPrev.addEventListener('click', (e) => {
        modalInfoContainer.innerHTML = '';
        if (currentCardIndex === 0) {
            modalInfoContainer.innerHTML = currentModals[currentModals.length - 1];
            currentCardIndex = currentModals.length - 1
        } else {
            modalInfoContainer.innerHTML = currentModals[currentCardIndex-1];
            currentCardIndex -= 1
        }
        e.stopPropagation();
    });
    modalNext.addEventListener('click', (e) => {
        modalInfoContainer.innerHTML = '';
        if (currentCardIndex === currentModals.length - 1) {
            modalInfoContainer.innerHTML = currentModals[0];
            currentCardIndex = 0
        } else {
            modalInfoContainer.innerHTML = currentModals[currentCardIndex+1];
            currentCardIndex += 1
        }
        e.stopPropagation();
    });
}

function closeModal(e) {
    const modalInfoContainer = document.querySelector('.modal-info-container');
    modalInfoContainer.remove();
    modalContainer.style.display = 'none';
    e.stopPropagation();
}
searchInput.addEventListener('keyup', () => {
    search();
})
function search () {
    while (gallery.firstElementChild) {
        gallery.removeChild(gallery.firstElementChild)
    }
    //searchModals = [];

    for (let i=0; i<employeeCards.length; i++) {
        if (employeeCards[i].children[0].childNodes[2].nextElementSibling.childNodes[1].textContent.toLowerCase().includes(searchInput.value.toLowerCase())) {
            gallery.appendChild(employeeCards[i]);
            //searchModals.push(employeeModals[i]);
        }
    } 

    if (searchInput.value.length === 0) {
        for (let i=0; i< employeeCards.length; i++) {
            gallery.appendChild(employeeCards[i]);
        }
        //searchModals = employeeModals;
    } else {
        
    }
    const currentemployeeCards = document.getElementsByClassName('card');
    if (currentemployeeCards.length === 0) {
        gallery.insertAdjacentHTML("afterbegin", `<span class = "no-results">No Results found.</span>`);
    } 
    for (let i=0; i<currentemployeeCards.length; i++) {
            currentemployeeCards[i].childNodes[1].id = [i];         
    }
}



