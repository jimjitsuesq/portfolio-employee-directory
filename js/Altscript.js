const gallery = document.getElementById('gallery');
const cardInfo = document.querySelector('.card-info-container');
const modalDiv = document.querySelector('.modal');
const modalContainer = document.querySelector('.modal-container');
//const modalInfoContainer = document.querySelector('.modal-info-container');
const searchInput = document.getElementById('search-input');
const searchSubmit = document.getElementById('search-submit');
let initialCards = [];
let initialModals = [];
let searchCards = [];
let searchModals = [];
let cardClick;

modalContainer.style.display = 'none';
searchSubmit.style.display = 'none';
function generateCardsModals (data) {
    data.results.map( (person, index) => {
        //const card = document.createElement('div');
        //card.insertAdjacentHTML('beforeend', `
        let html =
            `<div class="card" id= ${index}>
            <div class="card-img-container">
                <img class="card-img" src="${person.picture.large}" alt="profile picture">
            </div>
            <div class="card-info-container">
                <h3 id="name" class="card-name cap">${person.name.first} ${person.name.last}</h3>
                <p class="card-text">${person.email}</p>
                <p class="card-text cap">${person.location.city}, ${person.location.state}</p>
            </div>
            </div>`
        //);
        initialCards.push(html);
        //searchCards.push(card);
    });
    searchCards = [...initialCards];
    //searchCards = JSON.parse(JSON.stringify(initialCards));
    for (let i=0; i<searchCards.length; i++) {
    //   searchCards[i].children[0].childNodes[3].childNodes[1].childNodes[0].textContent = 'SEARCH';
        
    }
    data.results.map( (person, index) => {
        
        const fixedPhone = person.cell.replace("-", " ")
        const birthYear = person.dob.date.slice(0, 4)
        const birthMonth = person.dob.date.slice(5, 7)
        const birthDay = person.dob.date.slice(8, 10)

        let html = 
        //modal.insertAdjacentHTML('beforeend', 
            //<div class="modal">
            //<button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
            //<div class="modal-info-container" id=${index}>
                `<img class="modal-img" src="${person.picture.large}" alt="profile picture">
                <h3 id="name" class="modal-name cap">${person.name.first} ${person.name.last}</h3>
                <p class="modal-text">${person.email}</p>
                <p class="modal-text cap">${person.location.city}</p>
                <hr>
                <p class="modal-text">${fixedPhone}</p>
                <p class="modal-text">123 Portland Ave., ${person.location.city}, ${person.location.state} ${person.location.postcode}</p>
                <p class="modal-text">Birthday: ${birthMonth}/${birthDay}/${birthYear}</p>`
            //</div>
        //);
        initialModals.push(html);
        });
    displayInitialCards();
    
}

/* function listener (event) {
    cardClick = event.target;
            findID(cardClick);
            displayModal(ModalId, initialModals);
            e.stopPropagation;
} */

function addModalListener () {
    const currentCards = document.getElementsByClassName('card');
    for (let i=0; i<currentCards.length; i++) {
        currentCards[i].addEventListener('click', (e) => {
            cardClick = e.target;
            displayModal(cardClick, initialModals);
            e.stopPropagation;
            //return cardClick
        });
    }
}

function displayInitialCards () {
    for (let i=0; i<initialCards.length; i++) {
        gallery.appendChild(initialCards[i]);    
    }
    addModalListener();
}

function displayModal (click) {
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const modal = document.createElement('div');
    ModalId = click.closest('.card').id;
    modalContainer.style.display = 'block';
    modal.className = ('modal-info-container');
    modal.id = ModalId;
    modal.innerHTML = initialModals[ModalId];
    modalDiv.insertAdjacentElement('beforeend', modal);
    modalCloseBtn.addEventListener('click', closeModal);

}

function closeModal(e) {
    const modalInfoContainer = document.querySelector('.modal-info-container');
    e.stopPropagation();
    //modalInfoContainer.innerHTML =  '';
    modalInfoContainer.remove();
    modalContainer.style.display = 'none';
}

async function fetchEmployeeData () {
        const response = await fetch('https://randomuser.me/api/?results=12&nat=US&noinfo')
        const json = await response.json()
        .then((result) => {
            generateCardsModals(result)
        })
}
fetchEmployeeData();

function search () {
    while (gallery.firstElementChild) {
        gallery.removeChild(gallery.firstElementChild)
    }
    searchModals = [];
    if (searchInput.value.length === 0) {
        for (let i=0; i< searchCards.length; i++) {
            gallery.appendChild(searchCards[i]);
        }
        searchModals = initialModals;
    } else {
        for (let i=0; i<searchCards.length; i++) {
            if (searchCards[i].children[0].childNodes[2].nextElementSibling.childNodes[1].textContent.toLowerCase().includes(searchInput.value.toLowerCase())) {
                gallery.appendChild(searchCards[i]);
                searchModals.push(initialModals[i]);
            }
        } 
    }
    const currentSearchCards = document.getElementsByClassName('card');
    if (currentSearchCards.length === 0) {
        gallery.insertAdjacentHTML("afterbegin", `<span class = "no-results">No Results found.</span>`);
    } 
    for (let i=0; i<currentSearchCards.length; i++) {
            currentSearchCards[i].childNodes[1].id = [i];         
    }
}

searchInput.addEventListener('keyup', () => {
    search();
})

const modalPrev = document.getElementById('modal-prev');
const modalNext = document.getElementById('modal-next');