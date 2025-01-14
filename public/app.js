
let contacts = [];
const book = document.getElementById("book");
const nameInput = document.getElementById("name");
const phoneInput = document.getElementById("phone");
const contactList = document.getElementById("contact-list");

//read-get
async function renderList() {
  try {
    contactList.innerHTML = "";
    const response = await fetch("http://localhost:3000/get-contacts");
    if (!response.ok) {
      throw new Error(`Error al obtener contactos: ${response.statusText}`);
    }

    contacts = await response.json();

    if (contacts.length === 0) {
      showModal("No hay contactos en la lista.");
      return;
    }

    contacts.forEach((contact, index) => {
      const li = document.createElement("li");
       li.classList.add(
         "list-group-item",
         "d-flex",
         "justify-content-between",
         "align-items-center",
         "mb-2"
      );
      
      const contactInfo = document.createElement("div");
      contactInfo.classList.add("contact-info");

      const nameSpan = document.createElement("span");
       nameSpan.classList.add("contact-name");
      nameSpan.textContent = contact.name;

      const phoneSpan = document.createElement("span");
       phoneSpan.classList.add("contact-phone");
      phoneSpan.textContent = " : " + contact.phone;
      
      contactInfo.appendChild(nameSpan);
      contactInfo.appendChild(phoneSpan);


      const buttonsDiv = document.createElement("div");
      buttonsDiv.classList.add("d-flex", "gap-2");

      const deleteButton = document.createElement("button");
       deleteButton.classList.add("btn", "btn-danger", "delete-btn");
       deleteButton.textContent = "Delete";
       deleteButton.onclick = () => deleteContact(index);

      const editButton = document.createElement("button");
       editButton.classList.add("btn", "btn-warning", "edit-btn");
       editButton.textContent = "Edit";
      editButton.onclick = () => editContact(index);
      

       buttonsDiv.appendChild(editButton);
       buttonsDiv.appendChild(deleteButton);


      li.appendChild(contactInfo);
      li.appendChild(buttonsDiv);

      contactList.appendChild(li);
    });
  } catch (error) {
    console.error("Error al renderizar la lista:", error);
    showModal("Error al cargar los contactos. Intenta mas tarde.")
  }
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

  if (!nameValue || !phoneValue) {
    showModal("Por favor completa todos los campos.");
    return;
  }

  if (!/^\d+$/.test(phoneValue)) {
    showModal("El número de teléfono debe contener solo dígitos.");
    return;
  }

  if (phoneValue.length !== 10) {
    showModal("El número de teléfono debe tener exactamente 10 dígitos.");
    return;
  }

   if (!/^[A-Za-z\s]+$/.test(nameValue)) {
     showModal("El nombre solo puede contener letras.");
     return;
   }

  const contact = { name: nameValue, phone: phoneValue };

  try {
    const message = await addContactPromise(contact);
    console.log(message);
    renderList();
  } catch (error) {
    console.error(error);
    showModal("Error inesperado al agregar el contacto.");
  }
  nameInput.value = "";
  phoneInput.value = "";
}
//delete-delete
async function deleteContactPromise(contactID) {
  try {
    const response = await fetch(
      `http://localhost:3000/delete-contact/${contactID}`,
      {
        method: "DELETE",
      }
    );
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error al eliminar:", errorData.message || response.statusText)
      return;
    }
    const result = await response.json();
    return result.message;
  } catch (error) {
    console.error("Error al eliminar el contacto:", error.message);
    showModal("Error al eliminar el contacto. Intenta nuevamente.");
  }
}


async function deleteContact(index) {
  const contactID = contacts[index]._id;
  try {
    const message = await deleteContactPromise(contactID);
    console.log(message);
    contacts.splice(index, 1)
    renderList();
  } catch (error) {
    console.error(error);
    showModal("Error al eliminar el contacto. Intenta nuevamente.");
  }
}
//update-put
function editContact(index) {
  const contactToEdit = contacts[index];
  const li = contactList.children[index];

  li.innerHTML = `
    <input type="text" id="edit-name-${index}" value="${contactToEdit.name}">
    <input type="text" id="edit-phone-${index}" value="${contactToEdit.phone}">
    <button onclick="saveEdit(${index})">Guardar</button>
    <button onclick="cancelEdit()">Cancelar</button>
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
