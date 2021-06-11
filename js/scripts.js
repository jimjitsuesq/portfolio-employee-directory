const gallery = document.getElementById('gallery');
const cardInfo = document.querySelector('.card-info-container');
const modalDiv = document.querySelector('.modal');
const modalContainer = document.querySelector('.modal-container');
//const modalInfoContainer = document.querySelector('.modal-info-container');
const searchInput = document.getElementById('search-input');
const searchSubmit = document.getElementById('search-submit');
let employeeCards = [];
let employeeModals = [];
let currentCardId;

modalContainer.style.display = 'none';
searchSubmit.style.display = 'none';
function generateCardsModals (data) {
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
                `<img class="modal-img" src="${person.picture.large}" id=${index} alt="profile picture">
                <h3 id="name" class="modal-name cap">${person.name.first} ${person.name.last}</h3>
                <p class="modal-text">${person.email}</p>
                <p class="modal-text cap">${person.location.city}</p>
                <hr>
                <p class="modal-text">${fixedPhone}</p>
                <p class="modal-text">123 Portland Ave., ${person.location.city}, ${person.location.state} ${person.location.postcode}</p>
                <p class="modal-text">Birthday: ${birthMonth}/${birthDay}/${birthYear}</p>`
            //</div>
        //);
        employeeModals.push(html);
        });
    displayemployeeCards();
    
}

/* function listener (event) {
    cardClick = event.target;
            findID(cardClick);
            displayModal(ModalId, employeeModals);
            e.stopPropagation;
} */

function displayemployeeCards () {
    for (let i=0; i<employeeCards.length; i++) {
        gallery.appendChild(employeeCards[i]);    
    }
    addModalListener();
}

function addModalListener () {
    const currentCards = document.getElementsByClassName('card');
    for (let i=0; i<currentCards.length; i++) {
        currentCards[i].addEventListener('click', (e) => {
            cardClickTarget = e.target;
            cardClickTargetId = cardClickTarget.closest('.card').id;
            displayModal(cardClickTargetId);
            e.stopPropagation;
        });
    }
}

function displayModal (cardClickTargetId) {
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const modal = document.createElement('div');
    modal.id = cardClickTargetId;
    currentCardId = cardClickTargetId
    modalContainer.style.display = 'block';
    modal.className = ('modal-info-container');
    modal.innerHTML = employeeModals[cardClickTargetId];
    modalDiv.insertAdjacentElement('beforeend', modal);
    modalCloseBtn.addEventListener('click', closeModal);
    getCurrentCardIndex(currentCardId);
}

const modalPrev = document.getElementById('modal-prev');
const modalNext = document.getElementById('modal-next');

function getCurrentCardIndex (currentCardId) {
    const currentCards = [...(document.getElementsByClassName('card'))];
    
    let currentCardIndex = currentCards.findIndex(item => item.id === currentCardId);
    modalBrowse(currentCardIndex.valueOf())
}

function modalBrowse (currentCardIndex) {
    let modalInfoContainer = document.querySelector('.modal-info-container');
    const currentCards = [...(document.getElementsByClassName('card'))];
    let currentCardsIds = []
    currentCards.forEach(item => currentCardsIds.push(item.id))
    let currentModals = []
    currentCardsIds.forEach(item => currentModals.push(employeeModals[item]))
    //let currentCardIndexNum = currentCardIndex
    let currentModal;
    /* const previousCardIndex = currentCardIndex-1;
    const nextCardIndex = currentCardIndex+1;
    const previousCardModalIndex = parseInt(currentCards[previousCardIndex].id)
    const nextCardModalIndex = parseInt(currentCards[nextCardIndex].id) */
    modalPrev.addEventListener('click', (e) => {
        modalInfoContainer.innerHTML = '';
        if (currentCardIndex === 0) {
            modalInfoContainer.innerHTML = currentModals[currentModals.length - 1];
            currentCardIndex = currentModals.length - 1
        } else {
            modalInfoContainer.innerHTML = currentModals[currentCardIndex-1];
            currentCardIndex -= 1
        }
        console.log(currentCardIndex)
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
        console.log(currentCardIndex)
        e.stopPropagation();
    });
}

function closeModal(e) {
    const modalInfoContainer = document.querySelector('.modal-info-container');
    
    //modalInfoContainer.innerHTML =  '';
    modalInfoContainer.remove();
    modalContainer.style.display = 'none';
    e.stopPropagation();
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

searchInput.addEventListener('keyup', () => {
    search();
})

