let library = []
const libraryGrid = document.getElementById('library-grid')

const newBookModal = document.getElementById('new-book-modal')
const formTitle = document.getElementById('title')
const formAuthor = document.getElementById('author')
const formPages = document.getElementById('pages')
const formRead = document.getElementById('read-status')
const submitButton = document.getElementById('submit-book')

const infoModal = document.getElementById('book-info-modal')
const infoTitle = document.getElementById('book-info-title')
const infoAuthor = document.getElementById('book-info-author')
const infoPages = document.getElementById('book-info-pages')
const infoRead = document.getElementById('book-info-read')

const sorter = document.getElementById('sort-by')
const displayFilter = document.getElementById('show')

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

function rewriteGrid (array) {
    libraryGrid.innerHTML = ""
    array.forEach (book => {
        libraryGrid.appendChild(newBook().generate(book).bookElement)
    })
}

const display = (() => {
    const all = () => {
        document.querySelectorAll('.book').forEach (book => {
            book.style.display = 'flex' 
        })
    }

    const read = () => {
        document.querySelectorAll('.book').forEach (book => {
            book.style.display = book.getAttribute('read') === 'read' ? 'flex' : 'none'
        })
    }

    const unread = () => {
        document.querySelectorAll('.book').forEach (book => {
            book.style.display = book.getAttribute('read') === 'unread' ? 'flex' : 'none'
        })
    }

    const basedOnValue = (element) => {
        switch (element.value) {
            case 'All':
                all()
                break;
            case 'Read':
                read()
                break;
            case 'Unread':
                unread()
                break;
        }
    }

    return {basedOnValue}
})

const sort = (() => {
    const byTitleAtoZ = () => {
        library.sort((a,b) => a.title.toLowerCase() > b.title.toLowerCase() ? 1 : -1)
        rewriteGrid (library)
    }

    const byTitleZtoA = () => {
        library.sort((a,b) => a.title.toLowerCase() < b.title.toLowerCase() ? 1 : -1)
        rewriteGrid (library)
    }

    const byAuthorAtoZ = () => {
        library.sort((a,b) => a.author.toLowerCase() > b.author.toLowerCase() ? 1 : -1)
        rewriteGrid (library)
    }

    const byAuthorZtoA = () => {
        library.sort((a,b) => a.author.toLowerCase() < b.author.toLowerCase() ? 1 : -1)
        rewriteGrid (library)
    }

    const byShortest = () => {
        library.sort((a,b) => a.pages > b.pages ? 1 : -1)
        rewriteGrid (library)
    }

    const byLongest = () => {
        library.sort((a,b) => a.pages < b.pages ? 1 : -1)
        rewriteGrid (library)
    }

    const basedOnValue = (element) => {
        switch (element.value) {
            case 'Title A-Z':
                byTitleAtoZ()
                break;
            case 'Title Z-A':
                byTitleZtoA()
                break;
            case 'Author A-Z':
                byAuthorAtoZ()
                break;
            case 'Author Z-A':
                byAuthorZtoA()
                break;
            case 'Longest':
                byLongest()
                break;
            case 'Shortest':
                byShortest()
                break;
        }
    }

    return {basedOnValue}
})

const storage = (() => {
    const save = () => {
        localStorage.setItem ("library", libraryGrid.innerHTML)
    }

    const load = () => {
        libraryGrid.innerHTML = localStorage.getItem("library") ? localStorage.getItem("library") : ""
        if (libraryGrid.innerHTML !== "") {
            Array.from(document.querySelectorAll(".book")).forEach (element => {
                const book = new Book(`${element.getAttribute('title')}`,`${element.getAttribute('author')}`,`${element.getAttribute('pages')}`,`${element.getAttribute('read')}`)
                library.push(book)
            })
            Array.from(document.querySelectorAll(".book-info")).forEach (element => {
                element.onclick = function () {displayBookInfo(this)}
            })
            Array.from(document.querySelectorAll(".toggle-read")).forEach (element => {
                element.onclick = function () {toggleBookRead(this)}
            })
            Array.from(document.querySelectorAll(".book-remove")).forEach (element => {
                element.onclick = function () {removeBook(this.parentElement)}
            })
        }
    }

    return {save, load}
})

const newBook = (() => {
    const book = new Book(`${formTitle.value}`,`${formAuthor.value}`,`${formPages.value}`,`${formRead.value}`)
    const colorIndex = Math.floor(Math.random()*lightColors.length)
    const lightColor = lightColors[colorIndex]
    const darkColor = darkColors[colorIndex]

    const generate = ((book) => {
        const bookElement = document.createElement('div')
        bookElement.classList.add('book')
        bookElement.textContent = `${book.title}`
        bookElement.setAttribute ('title', `${book.title}`)
        bookElement.setAttribute ('author', `${book.author}`)
        bookElement.setAttribute ('pages', `${book.pages}`)
        bookElement.setAttribute ('read', `${book.read}`)
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
        libraryGrid.appendChild(generate(book).bookElement)
        storage().save()
    }

    return {addFromForm, generate}
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
    storage().save()
}

function toggleBookRead(element) {
    for (let i=0; i<(library.length); i++) {
        if (library[i].title === element.parentElement.title) {
            library[i].toggleRead()
        }
    }
    element.textContent = element.textContent === 'unread' ? 'read' : 'unread'
    element.parentElement.setAttribute('read',`${element.textContent}`)
    storage().save()
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

function loadDemo() {
    localStorage.setItem('library', `<div class="book" title="A Tale of Two Cities" author="Charles Dickens" pages="448" read="unread" style="background-color: rgb(217, 169, 255); color: rgb(88, 31, 132);">A Tale of Two Cities<p>by Charles Dickens</p><button class="book-info" style="border: 1px solid rgb(88, 31, 132); background-color: rgb(217, 169, 255); color: rgb(88, 31, 132);">ⓘ</button><button class="toggle-read" style="background-color: rgb(88, 31, 132); color: rgb(217, 169, 255);">unread</button><button class="book-remove" title="Remove A Tale of Two Cities" style="border: 1px solid rgb(88, 31, 132); background-color: rgb(217, 169, 255); color: rgb(88, 31, 132);">×</button></div><div class="book" title="To Kill A Mockingbird" author="Harper Lee" pages="336" read="unread" style="background-color: rgb(255, 169, 205); color: rgb(137, 31, 75);">To Kill A Mockingbird<p>by Harper Lee</p><button class="book-info" style="border: 1px solid rgb(137, 31, 75); background-color: rgb(255, 169, 205); color: rgb(137, 31, 75);">ⓘ</button><button class="toggle-read" style="background-color: rgb(137, 31, 75); color: rgb(255, 169, 205);">unread</button><button class="book-remove" title="Remove To Kill A Mockingbird" style="border: 1px solid rgb(137, 31, 75); background-color: rgb(255, 169, 205); color: rgb(137, 31, 75);">×</button></div><div class="book" title="The Catcher in the Rye" author="J. D. Salinger" pages="288" read="unread" style="background-color: rgb(202, 255, 169); color: rgb(71, 132, 33);">The Catcher in the Rye<p>by J. D. Salinger</p><button class="book-info" style="border: 1px solid rgb(71, 132, 33); background-color: rgb(202, 255, 169); color: rgb(71, 132, 33);">ⓘ</button><button class="toggle-read" style="background-color: rgb(71, 132, 33); color: rgb(202, 255, 169);">unread</button><button class="book-remove" title="Remove The Catcher in the Rye" style="border: 1px solid rgb(71, 132, 33); background-color: rgb(202, 255, 169); color: rgb(71, 132, 33);">×</button></div><div class="book" title="Brave New World" author="Aldous Huxley" pages="218" read="unread" style="background-color: rgb(255, 169, 205); color: rgb(137, 31, 75);">Brave New World<p>by Aldous Huxley</p><button class="book-info" style="border: 1px solid rgb(137, 31, 75); background-color: rgb(255, 169, 205); color: rgb(137, 31, 75);">ⓘ</button><button class="toggle-read" style="background-color: rgb(137, 31, 75); color: rgb(255, 169, 205);">unread</button><button class="book-remove" title="Remove Brave New World" style="border: 1px solid rgb(137, 31, 75); background-color: rgb(255, 169, 205); color: rgb(137, 31, 75);">×</button></div><div class="book" title="1984" author="George Orwell" pages="352" read="unread" style="background-color: rgb(202, 255, 169); color: rgb(71, 132, 33);">1984<p>by George Orwell</p><button class="book-info" style="border: 1px solid rgb(71, 132, 33); background-color: rgb(202, 255, 169); color: rgb(71, 132, 33);">ⓘ</button><button class="toggle-read" style="background-color: rgb(71, 132, 33); color: rgb(202, 255, 169);">unread</button><button class="book-remove" title="Remove 1984" style="border: 1px solid rgb(71, 132, 33); background-color: rgb(202, 255, 169); color: rgb(71, 132, 33);">×</button></div><div class="book" title="Of Mice and Men" author="John Steinbeck" pages="112" read="unread" style="background-color: rgb(217, 169, 255); color: rgb(88, 31, 132);">Of Mice and Men<p>by John Steinbeck</p><button class="book-info" style="border: 1px solid rgb(88, 31, 132); background-color: rgb(217, 169, 255); color: rgb(88, 31, 132);">ⓘ</button><button class="toggle-read" style="background-color: rgb(88, 31, 132); color: rgb(217, 169, 255);">unread</button><button class="book-remove" title="Remove Of Mice and Men" style="border: 1px solid rgb(88, 31, 132); background-color: rgb(217, 169, 255); color: rgb(88, 31, 132);">×</button></div><div class="book" title="Lord of the Flies" author="William Golding" pages="224" read="unread" style="background-color: rgb(169, 211, 255); color: rgb(35, 85, 137);">Lord of the Flies<p>by William Golding</p><button class="book-info" style="border: 1px solid rgb(35, 85, 137); background-color: rgb(169, 211, 255); color: rgb(35, 85, 137);">ⓘ</button><button class="toggle-read" style="background-color: rgb(35, 85, 137); color: rgb(169, 211, 255);">unread</button><button class="book-remove" title="Remove Lord of the Flies" style="border: 1px solid rgb(35, 85, 137); background-color: rgb(169, 211, 255); color: rgb(35, 85, 137);">×</button></div><div class="book" title="The Great Gatsby" author="F. Scott Fitzgerald" pages="208" read="unread" style="background-color: rgb(255, 169, 231); color: rgb(139, 29, 108);">The Great Gatsby<p>by F. Scott Fitzgerald</p><button class="book-info" style="border: 1px solid rgb(139, 29, 108); background-color: rgb(255, 169, 231); color: rgb(139, 29, 108);">ⓘ</button><button class="toggle-read" style="background-color: rgb(139, 29, 108); color: rgb(255, 169, 231);">unread</button><button class="book-remove" title="Remove The Great Gatsby" style="border: 1px solid rgb(139, 29, 108); background-color: rgb(255, 169, 231); color: rgb(139, 29, 108);">×</button></div><div class="book" title="A Clockwork Orange" author="Anthony Burgess" pages="240" read="unread" style="background-color: rgb(255, 169, 205); color: rgb(137, 31, 75);">A Clockwork Orange<p>by Anthony Burgess</p><button class="book-info" style="border: 1px solid rgb(137, 31, 75); background-color: rgb(255, 169, 205); color: rgb(137, 31, 75);">ⓘ</button><button class="toggle-read" style="background-color: rgb(137, 31, 75); color: rgb(255, 169, 205);">unread</button><button class="book-remove" title="Remove A Clockwork Orange" style="border: 1px solid rgb(137, 31, 75); background-color: rgb(255, 169, 205); color: rgb(137, 31, 75);">×</button></div>`)
    storage().load()
}