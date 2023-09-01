let library = []
const libraryGrid = document.getElementById('library-grid')
const sortAndFilter = document.getElementById('sort-buttons')

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

const filterSelector = document.getElementById('show')
const sortSelector = document.getElementById('sort-by')

const lightColors = [
    '#F68282', 
    '#F69A82', 
    '#F6BD82', 
    '#F6E082', 
    '#82F6AD', 
    '#82F6D7', 
    '#82E1F6', 
    '#82ADF6', 
    '#8882F6', 
    '#AB82F6', 
    '#D182F6', 
    '#F482F6', 
    '#F682E0', 
    '#F682B6'
]

const darkColors = [
    '#801212', 
    '#862C14', 
    '#864E14', 
    '#9D8311', 
    '#0E6D31', 
    '#107B5E', 
    '#116D82', 
    '#143D82', 
    '#16107B', 
    '#3E1786', 
    '#5E1580', 
    '#801182', 
    '#7D1469', 
    '#791341'
]

class Book {
    constructor (title,author,pages,read) {
        this.title = title
        this.author = author
        this.pages = pages
        this.read = read
        this.colorIndex = `${Math.floor(Math.random()*lightColors.length)}`
        this.lightColor = lightColors[this.colorIndex]
        this.darkColor = darkColors[this.colorIndex]
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

    const bookElement = (() => {
        const element = document.createElement('div')
        element.classList.add('book')
        element.textContent = `${book.title}`
        element.setAttribute ('title', `${book.title}`)
        element.setAttribute ('author', `${book.author}`)
        element.setAttribute ('pages', `${book.pages}`)
        element.setAttribute ('read', `${book.read}`)
        element.setAttribute ('colorIndex', `${book.colorIndex}`)
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

    return {bookElement}
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
    library.push(book)
    libraryGrid.appendChild(buildElement(book).bookElement().element)
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
        libraryGrid.appendChild(buildElement(book).bookElement().element)
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
                book.colorIndex = `${element.getAttribute('colorIndex')}`
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
    localStorage.setItem('library', `<div class="book" title="To Kill a Mockingbird" author="Harper Lee" pages="336" read="unread" style="background-color: rgb(246, 189, 130); color: rgb(134, 78, 20); display: flex;">To Kill a Mockingbird<p>by Harper Lee</p><button class="book-info" style="border: 1px solid rgb(134, 78, 20); background-color: rgb(246, 189, 130); color: rgb(134, 78, 20);">ⓘ</button><button class="toggle-read" style="background-color: rgb(134, 78, 20); color: rgb(246, 189, 130);">unread</button><button class="book-remove" title="Remove City Tale" style="border: 1px solid rgb(134, 78, 20); background-color: rgb(246, 189, 130); color: rgb(134, 78, 20);">×</button></div><div class="book" title="The Catcher in the Rye" author="J.D. Salinger" pages="288" read="unread" style="background-color: rgb(130, 246, 173); color: rgb(14, 109, 49); display: flex;">The Catcher in the Rye<p>by J.D. Salinger</p><button class="book-info" style="border: 1px solid rgb(14, 109, 49); background-color: rgb(130, 246, 173); color: rgb(14, 109, 49);">ⓘ</button><button class="toggle-read" style="background-color: rgb(14, 109, 49); color: rgb(130, 246, 173);">unread</button><button class="book-remove" title="Remove City Tale" style="border: 1px solid rgb(14, 109, 49); background-color: rgb(130, 246, 173); color: rgb(14, 109, 49);">×</button></div><div class="book" title="Of Mice and Men" author="John Steinbeck" pages="112" read="unread" style="background-color: rgb(246, 130, 130); color: rgb(128, 18, 18); display: flex;">Of Mice and Men<p>by John Steinbeck</p><button class="book-info" style="border: 1px solid rgb(128, 18, 18); background-color: rgb(246, 130, 130); color: rgb(128, 18, 18);">ⓘ</button><button class="toggle-read" style="background-color: rgb(128, 18, 18); color: rgb(246, 130, 130);">unread</button><button class="book-remove" title="Remove City Tale" style="border: 1px solid rgb(128, 18, 18); background-color: rgb(246, 130, 130); color: rgb(128, 18, 18);">×</button></div><div class="book" title="Lord of the Flies" author="William Golding" pages="224" read="unread" style="background-color: rgb(244, 130, 246); color: rgb(128, 17, 130); display: flex;">Lord of the Flies<p>by William Golding</p><button class="book-info" style="border: 1px solid rgb(128, 17, 130); background-color: rgb(244, 130, 246); color: rgb(128, 17, 130);">ⓘ</button><button class="toggle-read" style="background-color: rgb(128, 17, 130); color: rgb(244, 130, 246);">unread</button><button class="book-remove" title="Remove City Tale" style="border: 1px solid rgb(128, 17, 130); background-color: rgb(244, 130, 246); color: rgb(128, 17, 130);">×</button></div><div class="book" title="Brave New World" author="Aldous Huxley" pages="218" read="unread" style="background-color: rgb(246, 224, 130); color: rgb(157, 131, 17); display: flex;">Brave New World<p>by Aldous Huxley</p><button class="book-info" style="border: 1px solid rgb(157, 131, 17); background-color: rgb(246, 224, 130); color: rgb(157, 131, 17);">ⓘ</button><button class="toggle-read" style="background-color: rgb(157, 131, 17); color: rgb(246, 224, 130);">unread</button><button class="book-remove" title="Remove City Tale" style="border: 1px solid rgb(157, 131, 17); background-color: rgb(246, 224, 130); color: rgb(157, 131, 17);">×</button></div><div class="book" title="1984" author="George Orwell" pages="352" read="unread" style="background-color: rgb(136, 130, 246); color: rgb(22, 16, 123); display: flex;">1984<p>by George Orwell</p><button class="book-info" style="border: 1px solid rgb(22, 16, 123); background-color: rgb(136, 130, 246); color: rgb(22, 16, 123);">ⓘ</button><button class="toggle-read" style="background-color: rgb(22, 16, 123); color: rgb(136, 130, 246);">unread</button><button class="book-remove" title="Remove City Tale" style="border: 1px solid rgb(22, 16, 123); background-color: rgb(136, 130, 246); color: rgb(22, 16, 123);">×</button></div><div class="book" title="A Clockwork Orange" author="Anthony Burgess" pages="252" read="unread" style="background-color: rgb(246, 130, 182); color: rgb(121, 19, 65); display: flex;">A Clockwork Orange<p>by Anthony Burgess</p><button class="book-info" style="border: 1px solid rgb(121, 19, 65); background-color: rgb(246, 130, 182); color: rgb(121, 19, 65);">ⓘ</button><button class="toggle-read" style="background-color: rgb(121, 19, 65); color: rgb(246, 130, 182);">unread</button><button class="book-remove" title="Remove A Clockwork Orange" style="border: 1px solid rgb(121, 19, 65); background-color: rgb(246, 130, 182); color: rgb(121, 19, 65);">×</button></div><div class="book" title="A Tale of Two Cities" author="Charles Dickens" pages="448" read="unread" style="background-color: rgb(130, 225, 246); color: rgb(17, 109, 130); display: flex;">A Tale of Two Cities<p>by Charles Dickens</p><button class="book-info" style="border: 1px solid rgb(17, 109, 130); background-color: rgb(130, 225, 246); color: rgb(17, 109, 130);">ⓘ</button><button class="toggle-read" style="background-color: rgb(17, 109, 130); color: rgb(130, 225, 246);">unread</button><button class="book-remove" title="Remove A Tale of Two Cities" style="border: 1px solid rgb(17, 109, 130); background-color: rgb(130, 225, 246); color: rgb(17, 109, 130);">×</button></div>`)
    storage().load()
}