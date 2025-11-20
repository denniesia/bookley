const searchEl = document.getElementById('search');

/* Search Logic 
searchEl.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        searchBooks();
    }
});


async function searchBooks() {
    const query = searchEl.value.trim();

    const apiURL = `https://www.googleapis.com/books/v1/volumes?q=intitle:${query}+inauthor:${query}&maxResults=24`;
    const res = await fetch(apiURL);
    const data = await res.json();

    console.log(data)
}

*/
triggerThrillers()
function triggerThrillers() {
    const bookCategory = 'thriller'
    retrieveBooksByCategory(bookCategory)
}

async function retrieveBooksByCategory(bookCategory) {
    const query = encodeURIComponent(`subject:${bookCategory}`); 
    /* encodeURIComponent function that encodes a string so 
    it can be used as a URL query param */

    /* api endpoint for 6 books */
    const apiURL = `https://www.googleapis.com/books/v1/volumes?q=${query}&printType=books&orderBy=relevance&maxResults=6`;
    const res = await fetch(apiURL);

    const data = await res.json()
    const books = data.items; 
    extractBookInfo(books, bookCategory);
    
}

function extractBookInfo(rawItems, bookCategory) {
    
    for (const item of rawItems) {
        const bookObject = {
             title: item.volumeInfo?.title,
            authors: item.volumeInfo?.authors || ["Unknown author"],
            publisher: item.volumeInfo?.publisher || "Unknown publisher",
            description: item.volumeInfo?.description || "No description available.",
            categories: item.volumeInfo?.categories || ["Uncategorized"],
            language: item.volumeInfo?.language || "N/A",
            previewLink: item.volumeInfo?.previewLink || "#",
            imageLink: item.volumeInfo?.imageLinks?.thumbnail || "assets/img/default-cover.jpg",
            avgRating: item.volumeInfo?.averageRating || 0,
            ratingsCount: item.volumeInfo?.ratingsCount || 0,
            pageCount: item.volumeInfo?.pageCount || "Unknown",
        };
        createBookCard(bookObject, bookCategory) 
    }

}

function createBookCard(book, bookCategory) {
    const articleEl = document.createElement('article');
    const imgEl = document.createElement('img');
    const divBookMetaEL = document.createElement('div');
    const divTitleHeartEL = document.createElement('div');
    const h3El = document.createElement('h3');
    const iRegularHeart = document.createElement('i');
    const iSolidHeart = document.createElement('i');
    iSolidHeart.style.display = 'none'

    const divAuthorPublisherEl = document.createElement('div');
    const spanBookAuthorPublisherEl = document.createElement('span');
    const divCategoriesContEl = document.createElement('div');
    const pBookRatingEl = document.createElement('p');
    const spanRatingCountEl = document.createElement('span');

    const pBookDescriptionEl = document.createElement('p');
    const divLanguagePagesPreviewEl = document.createElement('div');
    
    const btnEl = document.createElement('button');

    const authors = Array.from(book.authors);
    const publishers = Array.from(book.publisher);

    /* Assign text */
    imgEl.src = book.imageLink;
    h3El.textContent = book.title;
    
    spanBookAuthorPublisherEl.textContent = `by ${authors.join(', ')} | Publisher: ${publishers.join(', ')}`;

    for (const cat of book.categories) {
        const divBookCategoryEl = document.createElement('div');
        divBookCategoryEl.textContent = cat;
        divBookCategoryEl.classList.add(bookCategory);
        divCategoriesContEl.appendChild(divBookCategoryEl);
    }

    pBookRatingEl.textContent = `⭐ ${book.avgRating}`;
    spanRatingCountEl.textContent = `(${book.ratingsCount})`;
    pBookDescriptionEl.textContent = book.description;

    for (let item of [book.language, book.pageCount, book.previewLink]) {
        const newDiv = document.createElement('div');
        newDiv.textContent = item;

        divLanguagePagesPreviewEl.appendChild(newDiv)
    }

    /* Assign Classes */
    articleEl.classList.add('bookCard');
    imgEl.classList.add('bookCover');
    divBookMetaEL.classList.add('bookMeta');
    divTitleHeartEL.classList.add('titleHeart');
    h3El.classList.add('bookTitle');
    iRegularHeart.classList.add('fa-regular', 'fa-heart');
    iSolidHeart.classList.add('fa-solid', 'fa-heart');
    divAuthorPublisherEl.classList.add('authorPublisher');
    divCategoriesContEl.classList.add('categoriesCont');
    pBookRatingEl.classList.add('bookRating');
    spanRatingCountEl.classList.add('ratingCount');
    pBookDescriptionEl.classList.add('bookDescription');
    divLanguagePagesPreviewEl.classList.add('languagePagesPreview');
    btnEl.classList.add('wantToRead')

    /* Append Children */
    articleEl.appendChild(imgEl);
    articleEl.appendChild(divBookMetaEL);
    divBookMetaEL.appendChild(divTitleHeartEL);
    divTitleHeartEL.appendChild(h3El);
    divTitleHeartEL.appendChild(iRegularHeart);
    divTitleHeartEL.appendChild(iSolidHeart);
    divAuthorPublisherEl.appendChild(spanBookAuthorPublisherEl);
    articleEl.appendChild(divAuthorPublisherEl);
    
    divBookMetaEL.appendChild(divAuthorPublisherEl)
    divBookMetaEL.appendChild(divCategoriesContEl)
    divBookMetaEL.appendChild(pBookRatingEl)
    divBookMetaEL.appendChild(pBookDescriptionEl)
    divBookMetaEL.appendChild(divLanguagePagesPreviewEl)


    pBookRatingEl.appendChild(spanRatingCountEl);

    articleEl.appendChild(btnEl)

    appendToMainCategoryComponent(articleEl, bookCategory)
}

function appendToMainCategoryComponent(createdComponent, bookCategory) {
    if (bookCategory === 'thriller') {
        const categoryElement = document.getElementById('thriller');
        categoryElement.appendChild(createdComponent)
    }
}