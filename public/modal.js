function showModal(message) {
  const modal = document.querySelector("#modal");
  const modalMessage = document.querySelector("#modal-message");
  modalMessage.textContent = message;
  modal.classList.add("active");
  modal.classList.remove("close");


  const closeModal = document.querySelector(".btn-close");
  closeModal.onclick = () => {
    modal.classList.remove("active");
    modal.classList.add("close");
   };

  window.onclick = (event) => {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  };
}
window.showModal = showModal;