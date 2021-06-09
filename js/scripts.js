const gallery = document.getElementById('gallery');
const cardInfo = document.querySelector('.card-info-container')
const modalContainer = document.querySelector('.modal-container');
const modalInfoContainer = document.querySelector('.modal-info-container');
const searchInput = document.getElementById('search-input');
const searchSubmit = document.getElementById('search-submit');
let employeeCards = [];
let employeeModals = [];
let searchArray = [];
let modalClick;
//let currentModalId = null;

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
        card.addEventListener('click', (e) => {
            cardClick = e.target;
            clickModal(cardClick);
        });
        employeeCards.push(card);
    });
    data.results.map( (person, index) => {
        //const modal = document.createElement('div');
        const fixedPhone = person.cell.replace("-", " ")
        const birthYear = person.dob.date.slice(0, 4)
        const birthMonth = person.dob.date.slice(5, 7)
        const birthDay = person.dob.date.slice(8, 10)
        let modal =
        //modal.insertAdjacentHTML('beforeend', 
            //<div class="modal">
            //<button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
            //<div class="modal-info-container" id=${index}>
                `<img class="modal-img" src="${person.picture.large}" id="${index}" alt="profile picture">
                <h3 id="name" class="modal-name cap">${person.name.first} ${person.name.last}</h3>
                <p class="modal-text">${person.email}</p>
                <p class="modal-text cap">${person.location.city}</p>
                <hr>
                <p class="modal-text">${fixedPhone}</p>
                <p class="modal-text">123 Portland Ave., ${person.location.city}, ${person.location.state} ${person.location.postcode}</p>
                <p class="modal-text">Birthday: ${birthMonth}/${birthDay}/${birthYear}</p>`
            //</div>
        //);
        
        employeeModals.push(modal);
        });
    displayCards(employeeCards);
    
}

function displayCards (arr) {
    for (let i=0; i<arr.length; i++) {
        gallery.appendChild(arr[i]);
    }
}

function clickModal (click) {
    ModalId = click.closest('.card').id;
    displayModal(ModalId);
}

function displayModal (click) {
    const modalCloseBtn = document.getElementById('modal-close-btn');
    modalContainer.style.display = 'block';
    modalInfoContainer.innerHTML = `${employeeModals[click]}`
    modalCloseBtn.addEventListener('click', closeModal);
}

function closeModal(e) {
    const modalInfoContainer = document.querySelector('.modal-info-container');
    e.stopPropagation();
    modalInfoContainer.innerHTML =  '';
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
    searchArray = [];
    while (gallery.firstChild) {
        gallery.removeChild(gallery.firstChild)
    }
    for (let i=0; i<employeeCards.length; i++) {
        if (searchInput.value.length !== 0 && employeeCards[i].children[0].childNodes[2].nextElementSibling.childNodes[1].textContent.toLowerCase().includes(searchInput.value.toLowerCase())) {
            searchArray.push(employeeCards[i]);
            
        }
    } 
    if (searchInput.value.length === 0) {
        searchArray = employeeCards;
    }
    for (let i=0; i<searchArray.length; i++) {
            gallery.appendChild(searchArray[i]);
        }
    
    }
function noSearchResults (arr) {
    if (arr.length === 0) {
        gallery.insertAdjacentHTML("afterbegin", `<span class = "no-results">No Results found.</span>`)
    }
}
searchInput.addEventListener('keyup', () => {
    search();
    noSearchResults(searchArray);
})
searchSubmit.addEventListener('click', (e) => {
    search(e);
    noSearchResults(searchArray);
});

const modalPrev = document.getElementById('modal-prev');
const modalNext = document.getElementById('modal-next');

modalPrev.addEventListener('click', () => {
    const currentModalImage = modalInfoContainer.querySelector('img');
    currentModalId = parseInt(currentModalImage.id);
    if (currentModalId === 0) {
        displayModal(employeeCards.length - 1)
    } else {
        displayModal(currentModalId-1)
    }
})

modalNext.addEventListener('click', () => {
    const currentModalImage = modalInfoContainer.querySelector('img');
    currentModalId = parseInt(currentModalImage.id);
    if (currentModalId === employeeCards.length - 1) {
        displayModal(0)
    } else {
        displayModal(currentModalId+1)
    }
})
