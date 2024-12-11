let contacts = [];
const book = document.getElementById("book");
const nameInput = document.getElementById("name");
const phoneInput = document.getElementById("phone");
const contactList = document.getElementById("contact-list");

//read-get
async function renderList() {
  contactList.innerHTML = "";
  const response = await fetch("http://localhost:3000/get-contacts")
 contacts = await response.json();
   
  contacts.forEach((contact, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span>${contact.name}</span> - <span>${contact.phone}</span>
      <button onclick="deleteContact('${index}')">Delete</button>
      <button onclick="editContact(${index})">Edit</button>`;
    contactList.appendChild(li);
  });
}
//crear-post
async function addContactPromise(contact) {
  if (!contact.name || !contact.phone) {
    console.error("Invalid contact data: Name and phone are required");
    return;
  }
  try {
    const response = await fetch("http://localhost:3000/add-contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(contact),
    })
    if (!response.ok) {
      const errorData = await response.json();
      console.error(errorData.message);
      return;
    }
    const result = await response.json();
    return result.message
  } catch(error) {
    console.error(error.message);
  }
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
//delete-delete
async function deleteContactPromise(contactID) {
  try {
    const response = await fetch(`http://localhost:3000/delete-contact/${contactID}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      const errorData = await response.json();
      console.error(errorData.message);
      return
    }
    const result = await response.json();
    return result.message
  } catch(error) {
    console.error("Error al eliminar el contacto:", error.message);
    
  }
}

async function deleteContact(index) {
  const contactID = contacts[index]._id;
  try {
    const message = await deleteContactPromise(contactID);
    console.log(message);
    renderList();
  } catch (error) {
    console.error(error);
  }
}
//update-put
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

  const contactID = contacts[index]._id;


  try {
    const response = await fetch(
      `http://localhost:3000/update-contact/${contactID}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedContact)
      }
    );

    if (!response.ok) {

      const errorData = await response.json();
      console.error(errorData.message);
    }
    

    const result = await response.json();
    console.log(result.message);
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
