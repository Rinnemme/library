const newBookModal = document.getElementById(`new-book-modal`)
let library = []
const submitButton = document.getElementById(`submit-book`)
const libraryGrid = document.getElementById(`library-grid`)

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

function clearForm() {
    newBookTitle.value=""
    newBookAuthor.value=""
    newBookPages.value=""
    newBookRead.value="not read"
}

function submitBookForm(event) {
    event.preventDefault()
    const newBook = new Book(`${newBookTitle.value}`,`${newBookAuthor.value}`,`${newBookPages.value}`,`${newBookRead.value}`)
    library.push(newBook)
    const newBookElement = document.createElement("div")
    newBookElement.classList.add("book")
    newBookElement.textContent=`${newBook.title}`
    newBookElement.title=`${newBook.title}`
    const newRemoveButton = document.createElement("button")
    newRemoveButton.textContent = "x"
    newRemoveButton.classList.add("book-remove")
    newRemoveButton.onclick = function () {removeBook(this.parentElement)}
    newBookElement.appendChild(newRemoveButton)
    libraryGrid.appendChild(newBookElement)
    toggleNewBookModal()
    clearForm()
}
function removeBook(element) {
    library = library.filter (book => book.title !== `${element.title}`)
    element.parentElement.removeChild(element)
}

submitButton.addEventListener("click", submitBookForm)

