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
    ${contact.name} - ${contact.phone}
      <button onclick="deleteContact(${index})">Delete</button>
      <button onclick="editContact(${index})">Edit</button>`;
    contactList.appendChild(li);
  });
}

function addContact(event) {
  event.preventDefault();

  const nameValue = nameInput.value.trim();
  const phoneValue = phoneInput.value.trim();

  if (nameValue && phoneValue) {
    contacts.push({ name: nameValue, phone: phoneValue });
    nameInput.value = "";
    phoneInput.value = "";
    renderList();
  }
}

function deleteContact(index) {
  contacts.splice(index, 1);
  renderList();
}

function editContact(index) {
  const contactToEdit = contacts[index];
  nameInput.value = contactToEdit.name;
  phoneInput.value = contactToEdit.phone;

  book.removeEventListener("submit", addContact);
  book.addEventListener("submit", function updateContact(event) {
    event.preventDefault();

    const nameValue = nameInput.value.trim();
    const phoneValue = phoneInput.value.trim();

    if (nameValue && phoneValue) {
      contacts[index] = { name: nameValue, phone: phoneValue };
      nameInput.value = "";
      phoneInput.value = "";
      renderList();
    }

    book.removeEventListener("submit", updateContact);
    book.addEventListener("submit", addContact);
  });
}

book.addEventListener("submit", addContact);
renderList();
