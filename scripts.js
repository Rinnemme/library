let library = []
const libraryGrid = document.getElementById(`library-grid`)


const newBookModal = document.getElementById(`new-book-modal`)
const formTitle = document.getElementById(`title`)
const formAuthor = document.getElementById(`author`)
const formPages = document.getElementById(`pages`)
const formRead = document.getElementById(`read-status`)
const submitButton = document.getElementById(`submit-book`)

const infoModal = document.getElementById(`book-info-modal`)
const infoTitle = document.getElementById(`book-info-title`)
const infoAuthor = document.getElementById(`book-info-author`)
const infoPages = document.getElementById(`book-info-pages`)
const infoRead = document.getElementById(`book-info-read`)

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
    const book = new Book(`${formTitle.value}`,`${formAuthor.value}`,`${formPages.value}`,`${formRead.value}`)
    library.push(book)
}

function clearForm() {
    formTitle.value = ""
    formAuthor.value = ""
    formPages.value = ""
    formRead.value = "not read"
}

function generateBookElement() {
    const bookElement = document.createElement("div")
    bookElement.classList.add("book")
    bookElement.textContent = `${formTitle.value}`
    bookElement.title = `${formTitle.value}`
    bookElement.style.backgroundColor = `rgb(${Math.ceil(Math.random()*100)},${Math.ceil(Math.random()*100)},${Math.ceil(Math.random()*100)})`
    const bookAuthor = document.createElement("p")
    bookAuthor.textContent = `by ${formAuthor.value}`
    bookElement.appendChild(bookAuthor)
    const removeButton = document.createElement("button")
    removeButton.textContent = "×"
    removeButton.classList.add("book-remove")
    removeButton.onclick = function () {removeBook(this.parentElement)}
    bookElement.appendChild(removeButton)
    const readButton = document.createElement("button")
    readButton.textContent = `${formRead.value}`
    readButton.classList.add("toggle-read")
    readButton.onclick = function () {toggleBookRead(this)}
    bookElement.appendChild(readButton)
    const infoButton = document.createElement("button")
    infoButton.textContent = "ⓘ"
    infoButton.classList.add("book-info")
    infoButton.onclick = function () {displayBookInfo(this)}
    bookElement.appendChild(infoButton)
    libraryGrid.appendChild(bookElement)
}

function submitBookForm(event) {
    event.preventDefault()   
    addBook()
    generateBookElement()
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

function toggleInfoModal() {
    infoModal.style.display = infoModal.style.display === "flex" ? "none" : "flex"
}

function displayBookInfo(element) {
    for (let i=0; i<(library.length); i++) {
        if (library[i].title === element.parentElement.title) {
            infoTitle.textContent = `${library[i].title}`
            infoAuthor.textContent = `${library[i].author}`
            infoPages.textContent = `${library[i].pages}`
            infoRead.textContent = `${library[i].read}`
            toggleInfoModal()
        }
    }
}