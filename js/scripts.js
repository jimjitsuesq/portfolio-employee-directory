const gallery = document.getElementById("gallery");
const modalContainer = document.querySelector(".modal-container");
const searchSubmit = document.getElementById("search-submit");
const employeeCards = [];
const employeeModals = [];

modalContainer.style.display = "none";
searchSubmit.style.display = "none";

/**
 * Requests and waits for employee data from the server, then parses the
 * results and calls generateHTML to work with the data.
 */
async function fetchEmployeeData() {
  const response = await fetch(
    "https://randomuser.me/api/?results=12&nat=US&noinfo"
  );
  await response.json().then((result) => {
    generateHTML(result);
  });
}
fetchEmployeeData();

/**
 * Generates the employeeCards and employeeModals and collects them for later
 * use. Inserts an index field into the card HTML to reference later. Calls
 * displayEmployeeCards for initial screen.
 * @param {Object} data The data retrieved from randomuser.me
 */
function generateHTML(data) {
  data.results.map((person, index) => {
    const card = document.createElement("div");
    card.insertAdjacentHTML(
      "beforeend",
      `
      <div class="card" id= ${index}>
      <div class="card-img-container">
          <img class="card-img" src="${person.picture.large}" alt="profile picture">
      </div>
      <div class="card-info-container">
          <h2 id="name" class="card-name cap">${person.name.first} ${person.name.last}</h2>
          <p class="card-text">${person.email}</p>
          <p class="card-text cap">${person.location.city}, ${person.location.state}</p>
      </div>
      </div>
      `
    );
    employeeCards.push(card);
  });
  data.results.map((person) => {
    const fixedPhone = person.cell.replace("-", " ");
    const birthYear = person.dob.date.slice(0, 4);
    const birthMonth = person.dob.date.slice(5, 7);
    const birthDay = person.dob.date.slice(8, 10);
    let html =  `<img class="modal-img" src="${person.picture.large}" alt="profile picture">
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

/**
 * Displays cards for all of the employees. Adds event listeners to display
 * modals when clicked and pass along the id of the selected card.
 */
function displayemployeeCards() {
  for (let i = 0; i < employeeCards.length; i++) {
    gallery.appendChild(employeeCards[i]);
    employeeCards[i].addEventListener("click", (e) => {
      cardClickedId = e.target.closest(".card").id;
      displayModal(cardClickedId);
    });
  }
}

/**
 * Creates a div for the modal and injects the HTML for the selected card.
 * Displays the modal along with the modal close button. Adds event listener
 * to the close button that will call closeModal. Collects all of the currently
 * displayed cards into an array and then determines the index number of the
 * card clicked in that array. Calls modalBrowase to create toggle
 * functionality.
 * @param {string} cardClickedId The id of the card that was clicked to display
 * the modal.
 */
function displayModal(cardClickedId) {
  const currentCards = [...document.getElementsByClassName("card")];
  const modalDiv = document.querySelector(".modal");
  const modalCloseBtn = document.getElementById("modal-close-btn");
  const modal = document.createElement("div");
  modal.id = cardClickedId;
  modalContainer.style.display = "block";
  modal.className = "modal-info-container";
  modal.innerHTML = employeeModals[cardClickedId];
  modalDiv.insertAdjacentElement("beforeend", modal);
  modalCloseBtn.addEventListener("click", closeModal);
  let currentCardIndex = currentCards.findIndex(
    (item) => item.id === cardClickedId
  );
  modalBrowse(currentCardIndex);
}

/**
 * Displays the previous and next navigation buttons to toggle through the
 * displayed employees. Creates a new array containing the original index
 * values for each of the currently displayed cards and uses it to create
 * a new array containing the modals for each displayed card. Adds event
 * listeners to the navigation buttons to cycle through the HTML for the modals
 * using the currentCardIndex variable.
 * @param {number} currentCardIndex The original index value for the currently
 * displayed modal.
 */
function modalBrowse(currentCardIndex) {
  const modalInfoContainer = document.querySelector(".modal-info-container");
  const modalPrev = document.getElementById("modal-prev");
  const modalNext = document.getElementById("modal-next");
  const currentCards = [...document.getElementsByClassName("card")];
  const currentCardsIds = [];
  const currentModals = [];
  currentCards.forEach((item) => currentCardsIds.push(item.id));
  currentCardsIds.forEach((item) => currentModals.push(employeeModals[item]));
  modalPrev.addEventListener("click", () => {
    modalInfoContainer.innerHTML = "";
    if (currentCardIndex === 0) {
      modalInfoContainer.innerHTML = currentModals[currentModals.length - 1];
      currentCardIndex = currentModals.length - 1;
    } else {
      modalInfoContainer.innerHTML = currentModals[currentCardIndex - 1];
      currentCardIndex -= 1;
    }
  });
  modalNext.addEventListener("click", () => {
    modalInfoContainer.innerHTML = "";
    if (currentCardIndex === currentModals.length - 1) {
      modalInfoContainer.innerHTML = currentModals[0];
      currentCardIndex = 0;
    } else {
      modalInfoContainer.innerHTML = currentModals[currentCardIndex + 1];
      currentCardIndex += 1;
    }
  });
}

/**
 * Hides the modal and removes the modalInfoContainer div.
 */
function closeModal() {
  const modalInfoContainer = document.querySelector(".modal-info-container");
  modalInfoContainer.remove();
  modalContainer.style.display = "none";
}

/**
 * Adds a keyup event listener to the searchInput element that fires the search
 * function after each keystroke.
 */
const searchInput = document.getElementById("search-input");
searchInput.addEventListener("keyup", () => {
  search();
});

/**
 * First removes all cards displayed on the page. Then compares the string in
 * searchInput to the name of each employee, displaying it if there is a match.
 * If there are no matches, a "no-results" message is displayed.
 */
function search() {
  while (gallery.firstElementChild) {
    gallery.removeChild(gallery.firstElementChild);
  }
  for (let i = 0; i < employeeCards.length; i++) {
    const searchTarget =
      employeeCards[i].children[0].childNodes[2].nextElementSibling
        .childNodes[1];
    if (
      searchTarget.textContent
        .toLowerCase()
        .includes(searchInput.value.toLowerCase())
    ) {
      gallery.appendChild(employeeCards[i]);
    }
  }
  if (searchInput.value.length === 0) {
    employeeCards.forEach((item) => gallery.appendChild(item));
  }
  const currentCards = document.getElementsByClassName("card");
  if (currentCards.length === 0) {
    gallery.insertAdjacentHTML(
      "afterbegin",
      `<span class="no-results">No Results found.</span>`
    );
  }
}
