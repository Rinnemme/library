let library = []

const newBookModal = document.getElementById(`new-book-modal`)
const bookInfoModal = document.getElementById(`book-info-modal`)
const submitButton = document.getElementById(`submit-book`)
const libraryGrid = document.getElementById(`library-grid`)

const formTitle = document.getElementById(`title`)
const formAuthor = document.getElementById(`author`)
const formPages = document.getElementById(`pages`)
const formRead = document.getElementById(`read-status`)

const infoTitle = document.getElementById(`book-info-title`)
const infoAuthor = document.getElementById(`book-info-author`)
const infoPages = document.getElementById(`book-info-pages`)
const infoRead = document.getElementById(`book-info-read`)

const newBookClose = document.getElementById("close-new-book-modal")
const newBookButton = document.getElementById("new-book")

function toggleNewBookModal() {
    clearForm()
    newBookModal.style.display = newBookModal.style.display === "flex" ? "none" : "flex"
}

class Book {
    constructor (title,author,pages,read) {
        this.title = title
        this.author = author
        this.pages = pages
        this.read = read
        this.toggleRead = function() {
            if (this.read === "read") {
                this.read = "not read"
            } else this.read = "read"
        }
    }
}

function addBook() {
    const newBook = new Book(`${formTitle.value}`,`${formAuthor.value}`,`${formPages.value}`,`${formRead.value}`)
    library.push(newBook)
}

function clearForm() {
    formTitle.value = ""
    formAuthor.value = ""
    formPages.value = ""
    formRead.value = "not read"
}

function submitBookForm(event) {
    event.preventDefault()   
    const newBook = new Book(`${formTitle.value}`,`${formAuthor.value}`,`${formPages.value}`,`${formRead.value}`)
    library.push(newBook)
    const newBookElement = document.createElement("div")
    newBookElement.classList.add("book")
    newBookElement.textContent = `${newBook.title}`
    newBookElement.title = `${newBook.title}`
    newBookElement.style.backgroundColor = `rgb(${Math.ceil(Math.random()*100)},${Math.ceil(Math.random()*100)},${Math.ceil(Math.random()*100)})`
    const newBookBy = document.createElement("p")
    newBookBy.textContent = `by ${newBook.author}`
    newBookElement.appendChild(newBookBy)
    const newRemoveButton = document.createElement("button")
    newRemoveButton.textContent = "×"
    newRemoveButton.classList.add("book-remove")
    newRemoveButton.onclick = function () {removeBook(this.parentElement)}
    newBookElement.appendChild(newRemoveButton)
    const newReadButton = document.createElement("button")
    newReadButton.textContent = `${newBook.read}`
    newReadButton.classList.add("toggle-read")
    newReadButton.onclick = function () {toggleBookRead(this)}
    newBookElement.appendChild(newReadButton)
    const newInfoButton = document.createElement("button")
    newInfoButton.textContent = "ⓘ"
    newInfoButton.classList.add("book-info")
    newInfoButton.onclick = function () {displayBookInfo(this)}
    newBookElement.appendChild(newInfoButton)
    libraryGrid.appendChild(newBookElement)
    toggleNewBookModal()
    clearForm()
}

function removeBook(element) {
    library = library.filter (book => book.title !== `${element.title}`)
    element.parentElement.removeChild(element)
}

function toggleBookRead(element) {
    for (let i=0; i<(library.length); i++) {
        if (library[i].title === element.parentElement.title) {
            library[i].toggleRead()
        }
    }
    if (element.textContent === "not read") {
        element.textContent = "read"
    } else {
        element.textContent = "not read"
    }
}

function toggleBookInfoModal() {
    bookInfoModal.style.display = bookInfoModal.style.display === "flex" ? "none" : "flex"
}

function displayBookInfo(element) {
    for (let i=0; i<(library.length); i++) {
        if (library[i].title === element.parentElement.title) {
            infoTitle.textContent = `${library[i].title}`
            infoAuthor.textContent = `${library[i].author}`
            infoPages.textContent = `${library[i].pages}`
            infoRead.textContent = `${library[i].read}`
            toggleBookInfoModal()
        }
    }
}