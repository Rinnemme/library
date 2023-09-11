let library = []
const libraryGrid = document.getElementById('library-grid')
const sortAndFilter = document.getElementById('sort-buttons')

const newBookModal = document.getElementById('new-book-modal')
const newBookForm = document.getElementById('new-book-form')
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

const filterSelector = document.getElementById('show')
const sortSelector = document.getElementById('sort-by')
const lightColorSelector = document.getElementById('light-color-selector')
const darkColorSelector = document.getElementById('dark-color-selector')

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

function determineSortFilterDisplay() {
    sortAndFilter.style.display = library.length > 3 ? 'flex' : 'none'
}

function toggleNewBookModal() {
    clearForm()
    newBookModal.style.display = newBookModal.style.display === 'flex' ? 'none' : 'flex'
}

const buildElement = ((book) => {

    const newBook = (() => {
        const element = document.createElement('div')
        element.classList.add('book')
        element.textContent = `${book.title}`
        element.setAttribute ('title', `${book.title}`)
        element.setAttribute ('author', `${book.author}`)
        element.setAttribute ('pages', `${book.pages}`)
        element.setAttribute ('read', `${book.read}`)
        element.setAttribute ('lightColor', `${book.lightColor}`)
        element.setAttribute ('darkColor', `${book.darkColor}`)
        element.style.backgroundColor = `${book.lightColor}`
        element.style.color = `${book.darkColor}`
        const bookAuthor = document.createElement('p')
        bookAuthor.textContent = `by ${book.author}`
        element.appendChild(bookAuthor)
        element.appendChild(info().button)
        element.appendChild(read().button)
        element.appendChild(remove().button)
        return {element}
    })

    const info = (() => {
        const button = document.createElement('button')
        button.textContent = 'ⓘ'
        button.style.border = `1px solid ${book.darkColor}`
        button.style.backgroundColor = `${book.lightColor}`
        button.style.color = `${book.darkColor}`
        button.classList.add('book-info')
        button.onclick = function () {displayBookInfo(this)}
        return {button}
    })

    const read = (() => {
        const button = document.createElement('button')
        button.textContent = `${book.read}`
        button.classList.add('toggle-read')
        button.style.backgroundColor = `${book.darkColor}`
        button.style.color = `${book.lightColor}`
        button.onclick = function () {toggleBookRead(this)}
        return {button}
    })

    const remove = (() => {
        const button = document.createElement('button')
        button.textContent = '×'
        button.style.border = `1px solid ${book.darkColor}`
        button.style.backgroundColor = `${book.lightColor}`
        button.style.color = `${book.darkColor}`
        button.classList.add('book-remove')
        button.setAttribute('title',`Remove ${book.title}`)
        button.onclick = function () {removeBook(this.parentElement)}
        return {button}
    })

    return {newBook}
}) 

function clearForm() {
    formTitle.value = ''
    formAuthor.value = ''
    formPages.value = ''
    formRead.value = 'unread'
}

function submitBookForm(event) {
    event.preventDefault()   
    const book = new Book(`${formTitle.value}`,`${formAuthor.value}`,`${formPages.value}`,`${formRead.value}`)
    book.lightColor = `${lightColorSelector.value}`
    book.darkColor = `${darkColorSelector.value}`
    library.push(book)
    libraryGrid.appendChild(buildElement(book).newBook().element)
    determineSortFilterDisplay()
    storage().save()
    display().basedOnValue(filterSelector)
    sort().basedOnValue(sortSelector)
    toggleNewBookModal()
    clearForm()
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

function removeBook(element) {
    library = library.filter (book => book.title !== `${element.title}`)
    element.parentElement.removeChild(element)
    determineSortFilterDisplay()
    storage().save()
}

function rewriteGrid (array) {
    libraryGrid.innerHTML = ""
    array.forEach (book => {
        libraryGrid.appendChild(buildElement(book).newBook().element)
    })
}

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

const storage = (() => {
    const save = () => {
        localStorage.setItem ("library", libraryGrid.innerHTML)
    }

    const load = () => {
        libraryGrid.innerHTML = localStorage.getItem("library") ? localStorage.getItem("library") : ""
        if (libraryGrid.innerHTML !== "") {
            Array.from(document.querySelectorAll(".book")).forEach (element => {
                const book = new Book(`${element.getAttribute('title')}`,`${element.getAttribute('author')}`,`${element.getAttribute('pages')}`,`${element.getAttribute('read')}`)
                book.lightColor = `${element.getAttribute('lightColor')}`
                book.darkColor = `${element.getAttribute('darkColor')}`
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
        determineSortFilterDisplay()
    }

    return {save, load}
})

function loadDemo() {
    localStorage.setItem('library', `<div class="book" title="A Tale of Two Cities" author="Charles Dickens" pages="448" read="unread" lightcolor="#ffadad" darkcolor="#781212" style="background-color: rgb(255, 173, 173); color: rgb(120, 18, 18); display: flex;">A Tale of Two Cities<p>by Charles Dickens</p><button class="book-info" style="border: 1px solid rgb(120, 18, 18); background-color: rgb(255, 173, 173); color: rgb(120, 18, 18);">ⓘ</button><button class="toggle-read" style="background-color: rgb(120, 18, 18); color: rgb(255, 173, 173);">unread</button><button class="book-remove" title="Remove A Tale of Two Cities" style="border: 1px solid rgb(120, 18, 18); background-color: rgb(255, 173, 173); color: rgb(120, 18, 18);">×</button></div><div class="book" title="To Kill a Mockingbird" author="Harper Lee" pages="336" read="unread" lightcolor="#ffc799" darkcolor="#91530d" style="background-color: rgb(255, 199, 153); color: rgb(145, 83, 13); display: flex;">To Kill a Mockingbird<p>by Harper Lee</p><button class="book-info" style="border: 1px solid rgb(145, 83, 13); background-color: rgb(255, 199, 153); color: rgb(145, 83, 13);">ⓘ</button><button class="toggle-read" style="background-color: rgb(145, 83, 13); color: rgb(255, 199, 153);">unread</button><button class="book-remove" title="Remove To Kill a Mockingbird" style="border: 1px solid rgb(145, 83, 13); background-color: rgb(255, 199, 153); color: rgb(145, 83, 13);">×</button></div><div class="book" title="The Catcher in the Rye" author="J. D. Salinger" pages="288" read="unread" lightcolor="#ffe999" darkcolor="#917b0d" style="background-color: rgb(255, 233, 153); color: rgb(145, 123, 13); display: flex;">The Catcher in the Rye<p>by J. D. Salinger</p><button class="book-info" style="border: 1px solid rgb(145, 123, 13); background-color: rgb(255, 233, 153); color: rgb(145, 123, 13);">ⓘ</button><button class="toggle-read" style="background-color: rgb(145, 123, 13); color: rgb(255, 233, 153);">unread</button><button class="book-remove" title="Remove The Catcher in the Rye" style="border: 1px solid rgb(145, 123, 13); background-color: rgb(255, 233, 153); color: rgb(145, 123, 13);">×</button></div><div class="book" title="Brave New World" author="Aldous Huxley" pages="218" read="unread" lightcolor="#d6ff99" darkcolor="#67910d" style="background-color: rgb(214, 255, 153); color: rgb(103, 145, 13); display: flex;">Brave New World<p>by Aldous Huxley</p><button class="book-info" style="border: 1px solid rgb(103, 145, 13); background-color: rgb(214, 255, 153); color: rgb(103, 145, 13);">ⓘ</button><button class="toggle-read" style="background-color: rgb(103, 145, 13); color: rgb(214, 255, 153);">unread</button><button class="book-remove" title="Remove Brave New World" style="border: 1px solid rgb(103, 145, 13); background-color: rgb(214, 255, 153); color: rgb(103, 145, 13);">×</button></div><div class="book" title="1984" author="George Orwell" pages="352" read="unread" lightcolor="#99ffc0" darkcolor="#0d9170" style="background-color: rgb(153, 255, 192); color: rgb(13, 145, 112); display: flex;">1984<p>by George Orwell</p><button class="book-info" style="border: 1px solid rgb(13, 145, 112); background-color: rgb(153, 255, 192); color: rgb(13, 145, 112);">ⓘ</button><button class="toggle-read" style="background-color: rgb(13, 145, 112); color: rgb(153, 255, 192);">unread</button><button class="book-remove" title="Remove 1984" style="border: 1px solid rgb(13, 145, 112); background-color: rgb(153, 255, 192); color: rgb(13, 145, 112);">×</button></div><div class="book" title="Of Mice and Men" author="John Steinbeck" pages="112" read="unread" lightcolor="#99f8ff" darkcolor="#0d8991" style="background-color: rgb(153, 248, 255); color: rgb(13, 137, 145); display: flex;">Of Mice and Men<p>by John Steinbeck</p><button class="book-info" style="border: 1px solid rgb(13, 137, 145); background-color: rgb(153, 248, 255); color: rgb(13, 137, 145);">ⓘ</button><button class="toggle-read" style="background-color: rgb(13, 137, 145); color: rgb(153, 248, 255);">unread</button><button class="book-remove" title="Remove Of Mice and Men" style="border: 1px solid rgb(13, 137, 145); background-color: rgb(153, 248, 255); color: rgb(13, 137, 145);">×</button></div><div class="book" title="Lord of the Flies" author="William Golding" pages="224" read="unread" lightcolor="#99c5ff" darkcolor="#0d4091" style="background-color: rgb(153, 197, 255); color: rgb(13, 64, 145); display: flex;">Lord of the Flies<p>by William Golding</p><button class="book-info" style="border: 1px solid rgb(13, 64, 145); background-color: rgb(153, 197, 255); color: rgb(13, 64, 145);">ⓘ</button><button class="toggle-read" style="background-color: rgb(13, 64, 145); color: rgb(153, 197, 255);">unread</button><button class="book-remove" title="Remove Lord of the Flies" style="border: 1px solid rgb(13, 64, 145); background-color: rgb(153, 197, 255); color: rgb(13, 64, 145);">×</button></div><div class="book" title="A Clockwork Orange" author="Anthony Burgess" pages="240" read="unread" lightcolor="#c799ff" darkcolor="#630d91" style="background-color: rgb(199, 153, 255); color: rgb(99, 13, 145); display: flex;">A Clockwork Orange<p>by Anthony Burgess</p><button class="book-info" style="border: 1px solid rgb(99, 13, 145); background-color: rgb(199, 153, 255); color: rgb(99, 13, 145);">ⓘ</button><button class="toggle-read" style="background-color: rgb(99, 13, 145); color: rgb(199, 153, 255);">unread</button><button class="book-remove" title="Remove A Clockwork Orange" style="border: 1px solid rgb(99, 13, 145); background-color: rgb(199, 153, 255); color: rgb(99, 13, 145);">×</button></div>`)
    storage().load()
}

function closeNewBookModal(event) {
    if (event.target!==newBookForm
        && !Array.from(document.getElementsByTagName('input')).includes(event.target)
        && !Array.from(document.getElementsByTagName('label')).includes(event.target)
        && !Array.from(document.getElementsByTagName('select')).includes(event.target)
        && !Array.from(document.getElementsByTagName('button')).includes(event.target)) {
        newBookModal.style.display = 'none'
    } else {return}
}

newBookModal.addEventListener("click", function() {closeNewBookModal(event)})

function closeInfoModal(event) {
    if (!Array.from(document.getElementsByTagName('h4')).includes(event.target)
        && event.target!== infoTitle && event.target!== infoAuthor
        && event.target!== infoPages && event.target!== infoRead) {
        infoModal.style.display = 'none'
    } else {return}
}

infoModal.addEventListener("click", function() {closeInfoModal(event)})

document.onkeydown = (event) => {
    if (event.key === "Escape") {
        closeNewBookModal(event)
        closeInfoModal(event)
    }
}
