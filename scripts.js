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

const lightColors = [
    '#FFA9A9', 
    '#FFC0A9', 
    '#FFDDA9', 
    '#CAFFA9', 
    '#A9FFBC', 
    '#A9FFE5', 
    '#A9F2FF', 
    '#A9D3FF', 
    '#A9AFFF', 
    '#B8A9FF', 
    '#D9A9FF', 
    '#F6A9FF', 
    '#FFA9E7', 
    '#FFA9CD'
]

const darkColors = [
    '#862525', 
    '#8B3F23', 
    '#8B6120', 
    '#478421', 
    '#1D7D32', 
    '#1F8969', 
    '#1D7382', 
    '#235589', 
    '#202784', 
    '#34228B', 
    '#581F84', 
    '#7C2186', 
    '#8B1D6C', 
    '#891F4B'
]

class Book {
    constructor (title,author,pages,read) {
        this.title = title
        this.author = author
        this.pages = pages
        this.read = read
        this.toggleRead = function() {
            this.read = this.read === 'read' ? 'unread' : 'read'
        }
    }
}

function toggleNewBookModal() {
    clearForm()
    newBookModal.style.display = newBookModal.style.display === 'flex' ? 'none' : 'flex'
}

const newBook = (() => {
    const book = new Book(`${formTitle.value}`,`${formAuthor.value}`,`${formPages.value}`,`${formRead.value}`)
    const colorIndex = Math.floor(Math.random()*lightColors.length)
    const lightColor = lightColors[colorIndex]
    const darkColor = darkColors[colorIndex]

    const generate = (() => {
        const bookElement = document.createElement('div')
        bookElement.classList.add('book')
        bookElement.textContent = `${book.title}`
        bookElement.title = book.title
        bookElement.style.backgroundColor = `${lightColor}`
        bookElement.style.color = `${darkColor}`
        const bookAuthor = document.createElement('p')
        bookAuthor.textContent = `by ${book.author}`
        bookElement.appendChild(bookAuthor)
        bookElement.appendChild(info().button)
        bookElement.appendChild(read().button)
        bookElement.appendChild(remove().button)
        return {bookElement}
    })

    const info = (() => {
        const button = document.createElement('button')
        button.textContent = 'ⓘ'
        button.style.border = `1px solid ${darkColor}`
        button.style.backgroundColor = `${lightColor}`
        button.style.color = `${darkColor}`
        button.classList.add('book-info')
        button.onclick = function () {displayBookInfo(this)}
        return {button}
    })

    const read = (() => {
        const button = document.createElement('button')
        button.textContent = `${book.read}`
        button.classList.add('toggle-read')
        button.style.backgroundColor = `${darkColor}`
        button.style.color = `${lightColor}`
        button.onclick = function () {toggleBookRead(this)}
        return {button}
    })

    const remove = (() => {
        const button = document.createElement('button')
        button.textContent = '×'
        button.style.border = `1px solid ${darkColor}`
        button.style.backgroundColor = `${lightColor}`
        button.style.color = `${darkColor}`
        button.classList.add('book-remove')
        button.setAttribute('title',`Remove ${book.title}`)
        button.onclick = function () {removeBook(this.parentElement)}
        return {button}
    })

    const addFromForm = () => {
        library.push(book)
        libraryGrid.appendChild(generate().bookElement)
    }

    return {addFromForm}
}) 

function clearForm() {
    formTitle.value = ''
    formAuthor.value = ''
    formPages.value = ''
    formRead.value = 'unread'
}

function submitBookForm(event) {
    event.preventDefault()   
    newBook().addFromForm()
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
    element.textContent = element.textContent === 'unread' ? 'read' : 'unread'
}

function toggleInfoModal() {
    infoModal.style.display = infoModal.style.display === 'flex' ? 'none' : 'flex'
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