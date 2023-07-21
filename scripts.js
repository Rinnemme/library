const newBookModal = document.getElementById(`new-book-modal`)

function toggleNewBookModal() {
    if (newBookModal.style.display==="flex") {
        newBookModal.style.display="none"
        } else {newBookModal.style.display="flex"
    }
}