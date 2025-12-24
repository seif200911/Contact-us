var totalContacts = document.getElementById("total-contacts");
var totalFav = document.getElementById("total-fav");
var totalEmergency = document.getElementById("total-emergency");
var searchInput = document.getElementById("seearch-input");
var AllContacts = document.getElementById("contact-cards");
var favContacts = document.getElementById("favplace");
var emergencyContacts = document.getElementById("emegencyplace");
var imagePerson = document.getElementById("file-uplaod");
var fullName = document.getElementById("full-name");
var phoneNumber = document.getElementById("phone-number");
var email = document.getElementById("email");
var address = document.getElementById("address");
var group = document.getElementById("group");
var notes = document.getElementById("note-text");
var favoriteChechbox = document.getElementById("favorite-checkbox");
var emergencyCheckbox = document.getElementById("emergency-checkbox");
var starIcon = document.getElementById("star-icon");
var heartIcon = document.getElementById("heart-icon");
var starButton = document.getElementById("star-button");
var heartButton = document.getElementById("heart-button");
var addContactButton = document.getElementById("add-contact");
var editContactButton = document.getElementById("edit-contact");

var nameRegex = /^[a-zA-Z ]{3,}$/;
var phoneRegex = /^01[0-9]{9}$/;

var emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;


var contactList = JSON.parse(localStorage.getItem("contacts")) || [];
var totalContactsCount = contactList.length;

var updateIndex;

displayAllContacts();



function changeBgColor() {
  var colorList = [
    { colorOne: "#0ea5e9", colorTwo: "#2563eb" },
    { colorOne: "#111827", colorTwo: "#000000" },
    { colorOne: "#f59e0b", colorTwo: "#d97706" },
    { colorOne: "#22c55e", colorTwo: "#16a34a" },
    { colorOne: "#ef4444", colorTwo: "#dc2626" },
  ];
  var randomColor = Math.floor(Math.random() * colorList.length);
  return [colorList[randomColor].colorOne, colorList[randomColor].colorTwo];
}
function addContact() {
  if (validation() && !checkContactExist()) {
    var personContact = {
      image: checkImage(),
      fullName: fullName.value.trim(),
      phoneNumber: phoneNumber.value.trim(),
      email: email.value.trim(),
      address: address.value.trim(),
      group: group.value.trim(),
      notes: notes.value.trim(),
      isFavorite: favoriteChechbox.checked,
      isEmergency: emergencyCheckbox.checked,
      avatar: changeBgColor(),
    };

    contactList.push(personContact);
    localStorage.setItem("contacts", JSON.stringify(contactList));
    displayAllContacts();
    Swal.fire({
      title: "Done!",
      text: "Operation completed successfully",
      icon: "success",
      confirmButtonText: "OK",
    });
    clearForm();
  }
}
function openModalContact() {
  addContactButton.style.display = "block";
  editContactButton.style.display = "none";
  clearForm();
}
function toggleEmergencyContact(index) {
  var contact = contactList[index];
  contact.isEmergency = !contact.isEmergency;
  displayAllContacts();
  displayAllEmergencyContacts();
  saveOutStorage();
}

function toggleFavoriteContact(index) {
  const contact = contactList[index];
  contact.isFavorite = !contact.isFavorite;

  displayAllContacts();
  displayAllFavContacts();
  saveOutStorage();
}
function getValues(index) {
  updateIndex = index;
  var contact = contactList[index];
  fullName.value = contact.fullName;
  phoneNumber.value = contact.phoneNumber;
  email.value = contact.email;
  address.value = contact.address;
  group.value = contact.group;
  notes.value = contact.notes;
  favoriteChechbox.checked = contact.isFavorite;
  emergencyCheckbox.checked = contact.isEmergency;
  addContactButton.style.display = "none";
  editContactButton.style.display = "block";
}

function editContact() {
  contactList[updateIndex].fullName = fullName.value;
  contactList[updateIndex].phoneNumber = phoneNumber.value;
  contactList[updateIndex].email = email.value;
  contactList[updateIndex].address = address.value;
  contactList[updateIndex].group = group.value;
  contactList[updateIndex].notes = notes.value;
  contactList[updateIndex].isFavorite = favoriteChechbox.checked;
  contactList[updateIndex].isEmergency = emergencyCheckbox.checked;
  displayAllContacts();
  saveOutStorage();
}

function checkMethodAction(method) {
  if (method === "edit") {
    editContact();
  } else {
    addContact();
  }
}

function alertDelete(index) {
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire("Deleted!", "Your contact has been deleted.", "success");
      deleteContact(index);
    }
  });
}

function deleteContact(index) {
  contactList.splice(index, 1);
  displayAllContacts();
  saveOutStorage();
}

function search() {
  var search = searchInput.value.trim().toLowerCase();
  console.log(search);
  AllContacts.innerHTML = "";
  for (var i = 0; i < contactList.length; i++) {
    if (contactList[i].fullName.toLowerCase().includes(search)) {
      displayContact(i);
    }
  }
}
function validation() {
  if (!nameRegex.test(fullName.value)) {
    fullName.classList.add("is-invalid");
    fullName.classList.remove("is-valid");
    Swal.fire({
      title: "Error!",
      text: "Name must be at least 3 characters long and contain only letters and spaces",
      icon: "error",
      confirmButtonText: "OK",
    });
    return false;
  }

  if (!phoneRegex.test(phoneNumber.value)) {
    phoneNumber.classList.add("is-invalid");
    phoneNumber.classList.remove("is-valid");
    Swal.fire({
      title: "Error!",
      text: "Phone number must be 11 digits long and start with 01",
      icon: "error",
      confirmButtonText: "OK",
    });
    return false;
  }

  if (!emailRegex.test(email.value)) {
    email.classList.add("is-invalid");
    email.classList.remove("is-valid");
    Swal.fire({
      title: "Error!",
      text: "Email must be valid",
      icon: "error",
      confirmButtonText: "OK",
    });
    return false;
  }

  return true;
}

function checkContactExist() {
  for (var i = 0; i < contactList.length; i++) {
    if (contactList[i].phoneNumber === phoneNumber.value) {
      Swal.fire({
        title: "Error!",
        text: "Phone number already exists",
        icon: "error",
        confirmButtonText: "OK",
      });
      return true;
    }
  }
  return false;
}


function displayContact(index) {
  var personCard = ` <div class="col-12 col-md-6">
              <div class="card border-0 shadow-sm rounded-4 p-3 mb-4">
                <!-- Card Header -->
                <div class="d-flex  mb-4">
                  <div class="d-flex gap-3 align-items-start">
                    <!-- Avatar -->
                    <div class="position-relative">
                      <div class="d-flex align-items-center justify-content-center text-white rounded-4"
                        style="width: 65px; height: 65px; background: linear-gradient(135deg, ${contactList[index].avatar[0]
    }, ${contactList[index].avatar[1]});">
                         <!-- Image -->
                       ${displayImage(contactList[index])}
                      </div>
                      ${checkCategory(contactList[index])}
                    </div>
                    
                    <!-- Name & Phone -->
                    <div>
                      <h5 class="fw-bold mb-1 fs-5">${contactList[index].fullName
    }</h5>
                      <div class="d-flex align-items-center gap-2 ">
                        <div
                          class="d-flex align-items-center justify-content-center rounded bg-primary-subtle text-primary"
                          style="width: 24px; height: 24px;">
                          <i class="fa-solid fa-phone" style="font-size: 0.75rem;"></i>
                        </div>
                        <span class="small fw-medium">${contactList[index].phoneNumber
    }</span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Card Body Details -->
                <div class="mb-4 d-flex flex-column gap-3">
                  <!-- Email -->
                  <div class="d-flex align-items-center gap-3">
                    <div class="d-flex align-items-center justify-content-center rounded-3"
                      style="width: 40px; height: 40px; background-color: var(--color-violet-100); color: var(--color-violet-600);">
                      <i class="fa-solid fa-envelope"></i>
                    </div>
                    <span class="text-muted fw-medium">${contactList[index].email
    }</span>
                  </div>

                  <!-- Address -->
                  <div class="d-flex align-items-center gap-3">
                    <div class="d-flex align-items-center justify-content-center rounded-3"
                      style="width: 40px; height: 40px; background-color: var(--color-green-100); color: var(--color-green-700);">
                      <i class="fa-solid fa-location-dot"></i>
                    </div>
                    <span class="text-muted fw-medium">${contactList[index].address
    }</span>
                  </div>

                  <!-- Tag -->
                  <div>
                    <span class="badge rounded-3 py-2 px-3 fw-medium"
                      style="background-color: var(--color-violet-100); color: var(--color-violet-700); font-size: 0.85rem;">
                      ${contactList[index].group}
                    </span>
                  </div>
                </div>

                <!-- Footer Actions -->
                <div class="d-flex justify-content-between align-items-center pt-2 border-top border-light">
                  <div class="d-flex gap-3">
                    <!-- Call Action -->
                    <button class="btn border-0 d-flex align-items-center justify-content-center rounded-3"
                      style="width: 45px; height: 45px; background-color: var(--color-green-100); color: var(--color-green-700);">
                      <i class="fa-solid fa-phone fs-6"></i>
                    </button>
                    <!-- Email Action -->
                    <button class="btn border-0 d-flex align-items-center justify-content-center rounded-3"
                      style="width: 45px; height: 45px; background-color: var(--color-violet-100); color: var(--color-violet-700);">
                      <i class="fa-solid fa-envelope fs-6"></i>
                    </button>
                  </div>

                  <div class="d-flex gap-4 align-items-center">
                    <button class="btn border-0 d-flex align-items-center justify-content-center rounded-3 cursor-pointer"
                       id="star-button">
                      <i class="${changeIconFavorite(
      contactList[index].isFavorite
    )} fs-6" onclick="toggleFavoriteContact(${index})"></i>
                    </button>
                    <button class="btn border-0 text-muted p-0 cursor-pointer" >
                      <i class="${changeIconEmergency(
      contactList[index].isEmergency
    )} fs-6" onclick="toggleEmergencyContact(${index})" id="heart-button"></i>
                    </button>
                    <button type="button" class="btn border-0 text-muted p-0 cursor-pointer" data-bs-toggle="modal" data-bs-target="#action-contact"
                      data-bs-whatever="@mdo"> <i class="fa-solid fa-pen fs-6" id="pen-button" onclick="getValues(${index})"></i>
                      </button>
                    <button class="btn border-0 text-muted p-0 cursor-pointer" id="trash-button" onclick="alertDelete(${index})">
                      <i class="fa-solid fa-trash fs-6"></i>
                    </button>
                  </div>
                </div>

              </div>
            </div>`;
  AllContacts.innerHTML += personCard;
}

function displayAllContacts() {
  if (contactList.length === 0) {
    AllContacts.innerHTML = `<div class="d-flex flex-column align-items-center justify-content-center p-5 text-muted">
      <i class="fa-regular fa-folder-open fs-1 mb-3"></i>
      <p class="m-0">No contacts found</p>
    </div>`;
  } else {
    AllContacts.innerHTML = "";
    for (var i = 0; i < contactList.length; i++) {
      displayContact(i);
    }
  }
  displayCount();
  displayAllFavContacts();
  displayAllEmergencyContacts();
}
function displayFavContact(index) {
  var favCard = `<div class="d-flex align-items-center justify-content-between p-3 rounded-4"
                  style="background-color: var(--color-amber-50);">
                  <div class="d-flex align-items-center gap-3">
                    <!-- Avatar -->
                    <div class="d-flex align-items-center justify-content-center text-white rounded-3 bg-primary"
                      style="width: 50px; height: 50px;">
                      <!-- Image -->
                      ${displayImage(contactList[index])}
                    </div>
                    <!-- Text -->
                    <div class="d-flex flex-column align-items-start">
                      <span class="fw-bold text-dark">${contactList[index].fullName
    }</span>
                      <span class="text-muted small">${contactList[index].phoneNumber
    }</span>
                    </div>
                  </div>
                  <!-- Button -->
                  <button class="btn border-0 d-flex align-items-center justify-content-center rounded-3 text-white"
                    style="width: 45px; height: 45px; background-color: var(--color-emerald-500);">
                    <i class="fa-solid fa-phone"></i>
                  </button>
                </div>`;

  favContacts.innerHTML += favCard;
}

function displayEmergencyContact(index) {
  var emergencyCard = `<div class="d-flex align-items-center justify-content-between p-3 rounded-4"
                  style="background-color: var(--color-amber-50);">
                  <div class="d-flex align-items-center gap-3">
                    <!-- Avatar -->
                    <div class="d-flex align-items-center justify-content-center text-white rounded-3 bg-primary"
                      style="width: 50px; height: 50px;">
                      <!-- Image -->
                      ${displayImage(contactList[index])}
                    </div>
                    <!-- Text -->
                    <div class="d-flex flex-column align-items-start">
                      <span class="fw-bold text-dark">${contactList[index].fullName
    }</span>
                      <span class="text-muted small">${contactList[index].phoneNumber
    }</span>
                    </div>
                  </div>
                  <!-- Button -->
                  <button class="btn border-0 d-flex align-items-center justify-content-center rounded-3 text-white"
                    style="width: 45px; height: 45px; background-color: var(--color-emerald-500);">
                    <i class="fa-solid fa-phone"></i>
                  </button>
                </div>`;

  emergencyContacts.innerHTML += emergencyCard;
}
function calculateTotalCount(property) {
  var total = 0;
  for (var i = 0; i < contactList.length; i++) {
    if (contactList[i][property]) {
      total++;
    }
  }
  return total;
}
function displayAllFavContacts() {
  favContacts.innerHTML = "";
  var hasFav = false;
  for (var i = 0; i < contactList.length; i++) {
    if (contactList[i].isFavorite) {
      hasFav = true;
      displayFavContact(i);
    }
  }
  if (!hasFav) {
    favContacts.innerHTML = `<div class="text-center p-3 text-muted small">
            <i class="fa-regular fa-star mb-2"></i>
            <p class="m-0">No favorites yet</p>
        </div>`;
  }
}

function displayAllEmergencyContacts() {
  emergencyContacts.innerHTML = "";
  var hasEmergency = false;
  for (var i = 0; i < contactList.length; i++) {
    if (contactList[i].isEmergency) {
      hasEmergency = true;
      displayEmergencyContact(i);
    }
  }
  if (!hasEmergency) {
    emergencyContacts.innerHTML = `<div class="text-center p-3 text-muted small">
            <i class="fa-solid fa-heart-pulse mb-2"></i>
            <p class="m-0">No emergency contacts</p>
        </div>`;
  }
}

function checkImage() {
  if (imagePerson.files.length > 0) {
    return imagePerson.files[0].name;
  }
  return "";
}

function createInitialImage(person) {
  var splitName = person.fullName.split(" ");
  if (splitName.length > 1) {
    return splitName[0][0] + splitName[1][0];
  }
  return splitName[0][0];
}
function validateInputRealTime(regx, input) {
  var value = input.value.trim();
  if (!regx.test(value)) {
    input.classList.add("is-invalid");
    input.classList.remove("is-valid");
  } else {
    input.classList.add("is-valid");
    input.classList.remove("is-invalid");
  }
}



function checkCategory(person) {
  var icons = "";
  var favoriteIcon = `<div
           class="position-absolute top-0 start-100 translate-middle badge cursor-pointer rounded-pill bg-warning p-1 border border-2 border-white" id="star-icon">
           <i class="fa-solid fa-star text-white"></i>
         </div>`;
  var emergencyIcon = `<div
           class="position-absolute top-100 start-100 translate-middle badge cursor-pointer rounded-pill bg-danger p-1 border border-2 border-white" id="heart-icon">
           <i class="fa-solid fa-heart-pulse text-white"></i>
         </div>`;
  if (person.isEmergency) {
    icons += emergencyIcon;
  }
  if (person.isFavorite) {
    icons += favoriteIcon;
  }
  return icons;
}

function changeIconEmergency(isEmergency) {
  if (isEmergency) {
    return "fa-solid fa-heart-pulse text-danger";
  } else {
    return "fa-regular fa-heart text-danger";
  }
}

function changeIconFavorite(isFavorite) {
  if (isFavorite) {
    return "fa-solid fa-star text-warning";
  } else {
    return "fa-regular fa-star text-gray";
  }
}



function displayCount() {
  totalContacts.textContent = contactList.length;
  totalFav.textContent = calculateTotalCount("isFavorite");
  totalEmergency.textContent = calculateTotalCount("isEmergency");
}


function displayImage(person) {
  if (person.image) {
    return `<img src="./imgs/${person.image}" class="rounded-3 w-100 h-100 object-fit-cover" alt="User" />`;
  }
  return `<span class="fw-bold fs-5 text-uppercase">${createInitialImage(
    person
  )}</span>`;
}

function clearForm() {
  imagePerson.value = "";
  fullName.value = "";
  phoneNumber.value = "";
  email.value = "";
  notes.value = "";
  group.value = "";
  favoriteChechbox.checked = false;
  emergencyCheckbox.checked = false;
}

function saveOutStorage() {
  localStorage.setItem("contacts", JSON.stringify(contactList));
}

