const contacts = [];
const book = document.getElementById("book");
const nameInput = document.getElementById("name");
const phoneInput = document.getElementById("phone");
const contactList = document.getElementById("contact-list");

function renderList() {
  contactList.innerHTML = "";

  contacts.forEach((contact, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span>${contact.name}</span> - <span>${contact.phone}</span>
      <button onclick="deleteContact(${index})">Delete</button>
      <button onclick="editContact(${index})">Edit</button>`;
    contactList.appendChild(li);
  });
}

function addContactPromise(contact) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (contact.name && contact.phone) {
        contacts.push(contact);
        resolve("Contact added successfully");
      } else {
        reject("Failed to add contact: invalid data");
      }
    }, 1000);
  });
}

async function addContact(event) {
  event.preventDefault();

  const nameValue = nameInput.value.trim();
  const phoneValue = phoneInput.value.trim();
  const contact = { name: nameValue, phone: phoneValue };

  try {
    const message = await addContactPromise(contact);
    console.log(message);
    renderList();
  } catch (error) {
    console.error(error);
  }
  nameInput.value = "";
  phoneInput.value = "";
}

function deleteContactPromise(index) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (contacts[index]) {
        contacts.splice(index, 1);
        resolve("contact deleted successfully");
      } else {
        reject("failed to delete contact: contact not found");
      }
    }, 1000);
  });
}

async function deleteContact(index) {
  try {
    const message = await deleteContactPromise(index);
    console.log(message);
    renderList();
  } catch (error) {
    console.error(error);
  }
}

function editContact(index) {
  const contactToEdit = contacts[index];
  const li = contactList.children[index];

  li.innerHTML = `
    <input type="text" id="edit-name-${index}" value="${contactToEdit.name}">
    <input type="text" id="edit-phone-${index}" value="${contactToEdit.phone}">
    <button onclick="saveEdit(${index})">Save</button>
    <button onclick="cancelEdit(${index})">Cancel</button>
  `;
}

async function saveEdit(index) {
  const nameInput = document.getElementById(`edit-name-${index}`);
  const phoneInput = document.getElementById(`edit-phone-${index}`);

  const nameValue = nameInput.value.trim();
  const phoneValue = phoneInput.value.trim();
  const updatedContact = { name: nameValue, phone: phoneValue };

  try {
    const message = await new Promise((resolve, reject) => {
      setTimeout(() => {
        if (nameValue && phoneValue) {
          contacts[index] = updatedContact;
          resolve("Contact updated successfully");
        } else {
          reject("Failed to update contact: invalid data");
        }
      }, 1000);
    });
    console.log(message);
    renderList();
  } catch (error) {
    console.error(error);
  }
}

function cancelEdit(index) {
  renderList();
}

book.addEventListener("submit", addContact);
renderList();
