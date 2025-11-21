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
// triggerThrillers()
// function triggerThrillers() {
//     const bookCategory = 'thriller'
//     retrieveBooksByCategory(bookCategory)
// }


function display() {
    const bookCategories = ['thriller', 'romance', 'history']
    retrieveBooksByCategoryFromOpenLibrary()    
}


async function retrieveBooksByCategoryFromOpenLibrary(category) {
    const category = 'thriller'; 
   

    /* api endpoint for 6 books */
    const apiURL = `https://openlibrary.org/subjects/${category}.json?limit=6`;

    const res = await fetch(apiURL);

    const data = await res.json()
    const books = data.works; 

    extractBookInfo(books, category)
}


function extractBookInfo(rawItems, bookCategory) {
    
    for (const item of rawItems) {
        const bookObject = {
            title: item.title,
        
            category: bookCategory,
           
        };


        fetchBookInfoFromGoogleBooks(bookObject)
    }

}

async function fetchBookInfoFromGoogleBooks(bookObject){
    const bookTitle = encodeURIComponent(bookObject.title);


    const apiURL = `https://www.googleapis.com/books/v1/volumes?q=intitle:${bookTitle}`
    const res = await fetch(apiURL);

    const data = await res.json()
    const additionalBookInfo = data.items[0]; 

    expandBookInfoFromGoogleBooks(bookObject, additionalBookInfo)
}


function expandBookInfoFromGoogleBooks(bookObject, additionalInfo){
    bookObject["publisher"] = additionalInfo.volumeInfo.publisher || "Unknown publisher";
    bookObject["language"] = additionalInfo.volumeInfo?.language || "N/A";
    bookObject["authors"] = additionalInfo.volumeInfo?.authors || "Unknown";
    bookObject["previewLink"] = additionalInfo.volumeInfo?.previewLink;
    bookObject["imageLink"] = additionalInfo.volumeInfo?.imageLinks?.thumbnail;
    bookObject["avgRating"] = additionalInfo.volumeInfo?.averageRating || "-";
    bookObject["ratingsCount"] = additionalInfo.volumeInfo?.ratingsCount || "-";
    bookObject["pageCount"] = additionalInfo.volumeInfo?.pageCount || "Unknown ";

    description = additionalInfo.volumeInfo?.description || "No description available."

    if (description.length > 500) {
        description = description.substring(0, 300) + "...";
    }

    bookObject["description"] = description;

    createBookCard(bookObject)
}

function createBookCard(book) {
    const articleEl = document.createElement('article');

    const divBookCardEl = document.createElement('div');
    const divBookInfoEl = document.createElement('div');
   
    const divBookMetaLeftEl = document.createElement('div');
    const imgEl = document.createElement('img');
    const pBookRatingEl = document.createElement('p');
    const spanRatingCountEl = document.createElement('span');
    const divCategoriesContEl = document.createElement('div');
    const divCategoryEl = document.createElement('div');

    const divBookMetaRightEl = document.createElement('div');

    const divTitleHeartEL = document.createElement('div');
    const h3El = document.createElement('h3');
  
    const iRegularHeart = document.createElement('i');
    const iSolidHeart = document.createElement('i');

    const divAuthorPublisherEl = document.createElement('div');
    const spanBookAuthorPublisherEl = document.createElement('span');
   
    const pBookDescriptionEl = document.createElement('p');
    const divLanguagePagesPreviewEl = document.createElement('div');
    const divLanguagePagesEl = document.createElement('div');
    
    const btnEl = document.createElement('button');

    const divLanguageEl = document.createElement('div');
    const divPagesEl = document.createElement('div');
    const divPreviewLinkEl = document.createElement('div');
    const aPreviewLinkEl = document.createElement('a');

    const iLanguageEl = document.createElement('i');
    const iPagesEl = document.createElement('i');
    const iPreviewEl = document.createElement('i');

    const authors = Array.from(book.authors);

    /* Assign text */
    imgEl.src = book.imageLink;
    h3El.textContent = book.title;
    
    spanBookAuthorPublisherEl.textContent = `by ${authors.join(', ')} | Publisher: ${book.publisher}`;

 
    const divBookCategoryEl = document.createElement('div');
    divBookCategoryEl.textContent = book.category;
    divBookCategoryEl.classList.add('bookCategory');
    divCategoriesContEl.appendChild(divBookCategoryEl);
    

    pBookRatingEl.textContent = `⭐ ${book.avgRating}`;
    spanRatingCountEl.textContent = `(${book.ratingsCount})`;
    pBookDescriptionEl.textContent = book.description;

   
    aPreviewLinkEl.target = "_blank";
   
    btnEl.textContent = 'Want to Read'

    /* Assign Classes */
    articleEl.classList.add('bookCard');
    divBookCardEl.classList.add('bookCard');
    divBookInfoEl.classList.add('bookInfo');
    divBookMetaLeftEl.classList.add('bookMetaLeft');
    imgEl.classList.add('bookCover');
    pBookRatingEl.classList.add('bookRating');
    spanRatingCountEl.classList.add('ratingCount');
    divCategoriesContEl.classList.add('categoriesCont');
   

    divBookMetaRightEl.classList.add('bookMetaRight');
    divTitleHeartEL.classList.add('titleHeart');
    h3El.classList.add('bookTitle');
    iRegularHeart.classList.add('fa-regular', 'fa-heart', 'regular-heart');
    iSolidHeart.classList.add('fa-solid', 'fa-heart', 'solid-heart', 'hidden');
    divAuthorPublisherEl.classList.add('bookAuthorPublisher');
   
    pBookDescriptionEl.classList.add('bookDescription');
    divLanguagePagesPreviewEl.classList.add('languagePagesPreview');
    divLanguagePagesEl.classList.add('languagePages');
    btnEl.classList.add('wantToRead')

    iLanguageEl.classList.add('fa-solid', 'fa-language');
    iPagesEl.classList.add('fa-regular', 'fa-file-lines');
    iPreviewEl.classList.add('fa-solid', 'fa-link')

    /* Append Children */
    articleEl.appendChild(divBookInfoEl);
    
    divBookInfoEl.appendChild(divBookMetaLeftEl);
    divBookInfoEl.appendChild(divBookMetaRightEl);

    divBookMetaLeftEl.appendChild(imgEl);
    divBookMetaLeftEl.appendChild(pBookRatingEl);
    divBookMetaLeftEl.appendChild(divCategoriesContEl);
    divBookMetaLeftEl.appendChild(divLanguagePagesPreviewEl)
    
    pBookRatingEl.appendChild(spanRatingCountEl);

    divCategoriesContEl.appendChild(divBookCategoryEl);

    divBookMetaRightEl.appendChild(divTitleHeartEL);
    divBookMetaRightEl.appendChild(divAuthorPublisherEl);
    divBookMetaRightEl.appendChild(pBookDescriptionEl);
    divBookMetaRightEl.appendChild(btnEl);
    

    divTitleHeartEL.appendChild(h3El);
    divTitleHeartEL.appendChild(iRegularHeart);
    divTitleHeartEL.appendChild(iSolidHeart);

    divAuthorPublisherEl.appendChild(spanBookAuthorPublisherEl);

    divLanguagePagesPreviewEl.appendChild(divLanguagePagesEl)
    divLanguagePagesEl.appendChild(divLanguageEl)
    divLanguagePagesEl.appendChild(divPagesEl)
    divLanguagePagesPreviewEl.appendChild(divPreviewLinkEl)

 
    divPagesEl.appendChild(iPagesEl);

    divPreviewLinkEl.appendChild(aPreviewLinkEl);
    
    aPreviewLinkEl.href = book.previewLink;

    divLanguageEl.append(iLanguageEl, book.language);
    divPagesEl.append(iPagesEl, book.pageCount);
    aPreviewLinkEl.append(iPreviewEl, " Preview");

  
    const favBtn = document.createElement('button');
    divTitleHeartEL.appendChild(favBtn);

    favBtn.type = 'button';
    favBtn.className = 'favBtn';
    favBtn.setAttribute('aria-pressed', 'false');

    favBtn.append(iRegularHeart, iSolidHeart);

    iSolidHeart.style.display = 'none';
    // iRegularHeart.addEventListener('click', addToFavorites);
    // iSolidHeart.addEventListener('click', removeFromFavorites);


    appendToMainCategoryComponent(articleEl, book.category)
}

function appendToMainCategoryComponent(cardElement, bookCategory) {
    if (bookCategory === 'thriller') {
        const categoryElement = document.getElementById('thriller');
        categoryElement.appendChild(cardElement);
    }
}


/* Design functions */

// function addToFavorites(e) {
//     const regularHeartEl = e.currentTarget; 
//     const parentEl = regularHeartEl.parentElement;
//     const children = parentEl.children;
//     const arrayChildren = Array.from(children);
//     const solidHeartEl = arrayChildren[1];
//     console.log(regularHeartEl)
//     if (regularHeartEl.style.display === 'inline') {
//         regularHeartEl.style.display = 'none';
//         solidHeartEl.style.display = 'inline';

//     } else {
//         regularHeartEl.style.display = 'inline';
//         solidHeartEl.style.display = 'none';

//     }
// }

// function removeFromFavorites(e) {
//     const solidHeartEl = e.currentTarget; 
//     const parentEl = solidHeartEl.parentElement;
//     const children = parentEl.children;
//     const arrayChildren = Array.from(children);
//     const regularHeartEl = arrayChildren[1];

//     if (solidHeartEl.style.display === 'inline') {
//         solidHeartEl.style.display = 'none';
//         regularHeartEl.style.display = 'inline';

//     } else {
//         solidHeartEl.style.display = 'inline';
//         regularHeartEl.style.display = 'none';

//     }
// }