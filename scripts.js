const newBookModal = document.getElementById(`new-book-modal`)
const library = []
const submitButton = document.getElementById(`submit-book`)

const newBookTitle = document.getElementById(`title`)
const newBookAuthor = document.getElementById(`author`)
const newBookPages = document.getElementById(`pages`)
const newBookRead = document.getElementById(`read-status`)

function toggleNewBookModal() {
    if (newBookModal.style.display==="flex") {
        newBookModal.style.display="none"
        } else {newBookModal.style.display="flex"
    }
}

function Book(title,author,pages,read) {
    this.title = title
    this.author = author
    this.pages = pages
    this.read = read
}

function addBook() {
    const newBook = new Book(`${newBookTitle.value}`,`${newBookAuthor.value}`,`${newBookPages.value}`,`${newBookRead.value}`)
    library.push(newBook)
}


