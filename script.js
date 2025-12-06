const searchEl = document.getElementById('search');
const pLoadingEl = document.getElementById('loadingMessage');

display()

function display() {
    loadBookCategories();

    searchEl.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') { 
            const query = searchEl.value.trim();
            if (query) {
                searchQuery(query); 
            }
        }
    });

}

async function searchQuery(query) {
    const searchResultsEl = document.getElementById('searchResults');
    searchResultsEl.innerHTML = "";

    query = encodeURIComponent(query);

    const apiURL = `https://www.googleapis.com/books/v1/volumes?q=intitle:${query}+inauthor:${query}&maxResults=10`;
    const res = await fetch(apiURL);
    const data = await res.json();

    const books = data.items || [];

    for (const item of books) {
        const info = item.volumeInfo || {};

        const bookObject = {
            title: info.title || "No Title",
            category: "Search Result"
        };

        expandBookInfoFromGoogleBooks(bookObject, item);
    }
}


function loadBookCategories() {
     const bookCategories = [
        'thriller', 
        'romance', 
        'history', 
        'psychology',
        'programming',
    ]

    for (const category of bookCategories) {
        retrieveBooksByCategoryFromOpenLibrary(category)    
    }
}


async function retrieveBooksByCategoryFromOpenLibrary(category) {
    try {
        /* api endpoint for 6 books */
        const apiURL = `https://openlibrary.org/subjects/${category}.json?limit=6`;

        const res = await fetch(apiURL);

        const data = await res.json()
        const books = data.works; 
        
        extractBookInfo(books, category)
    } catch (err) {
        console.error(err); 
    }
    
}

function extractBookInfo(rawItems, bookCategory) {
    pLoadingEl.style.display = 'none';
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

    try {
        const apiURL = `https://www.googleapis.com/books/v1/volumes?q=intitle:${bookTitle}`
        const res = await fetch(apiURL);

        const data = await res.json()
        const additionalBookInfo = data.items[0]; 

        expandBookInfoFromGoogleBooks(bookObject, additionalBookInfo)
    } catch (err) {
        console.error(err); 
    }

    
}

function expandBookInfoFromGoogleBooks(bookObject, additionalInfo){
    bookObject["publisher"] = additionalInfo.volumeInfo.publisher || "Unknown publisher";
    bookObject["language"] = additionalInfo.volumeInfo?.language || "N/A";
    bookObject["previewLink"] = additionalInfo.volumeInfo?.previewLink;
    bookObject["imageLink"] = additionalInfo.volumeInfo?.imageLinks?.thumbnail;
    bookObject["avgRating"] = additionalInfo.volumeInfo?.averageRating || "-";
    bookObject["ratingsCount"] = additionalInfo.volumeInfo?.ratingsCount || "-";
    bookObject["pageCount"] = additionalInfo.volumeInfo?.pageCount || "Unknown ";

    description = additionalInfo.volumeInfo?.description || "No description available."
    authors =  additionalInfo.volumeInfo?.authors || "Unknown";

    if (description.length > 250) {
        description = description.substring(0, 250) + "...";
    };
    if (authors.length > 9) {
        authors = authors.splice(authors.length - 9,) + "...";
    };


    bookObject["description"] = description;
    bookObject["authors"] = authors;

    createBookCard(bookObject)
}

function createBookCard(book) {
    const articleEl = document.createElement('article');
    articleEl.classList.add('bookCard');

    const divBookCardEl = document.createElement('div');
    divBookCardEl.classList.add('bookCard');
   
    const divBookInfoEl = document.createElement('div');
    divBookInfoEl.classList.add('bookInfo');

    const divBookMetaLeftEl = document.createElement('div');
    divBookMetaLeftEl.classList.add('bookMetaLeft');

    const imgEl = document.createElement('img');
    imgEl.classList.add('bookCover');
    if (book.imageLink) {
        imgEl.src = book.imageLink;
    } else {
        imgEl.src = 'assets/img/default_cover.webp'
    }
    imgEl.alt = 'Book Cover';

    const pBookRatingEl = document.createElement('p');
    pBookRatingEl.classList.add('bookRating');
    pBookRatingEl.textContent = `⭐ ${book.avgRating}`;
  
    const spanRatingCountEl = document.createElement('span');
    spanRatingCountEl.textContent = `(${book.ratingsCount})`;
    spanRatingCountEl.classList.add('ratingCount');
    
    const divCategoriesContEl = document.createElement('div');
    divCategoriesContEl.classList.add('categoriesCont');

    const divBookMetaRightEl = document.createElement('div');
    divBookMetaRightEl.classList.add('bookMetaRight');

    const divTitleHeartEL = document.createElement('div');
    divTitleHeartEL.classList.add('titleHeart');

    const h3El = document.createElement('h3');
    h3El.textContent = book.title;
    h3El.classList.add('bookTitle');

    const iRegularHeart = document.createElement('i');
    iRegularHeart.classList.add('fa-regular', 'fa-heart', 'regular-heart')

    const iSolidHeart = document.createElement('i');
    iSolidHeart.classList.add('fa-solid', 'fa-heart', 'solid-heart', 'hidden');

    const divAuthorPublisherEl = document.createElement('div');
    divAuthorPublisherEl.classList.add('bookAuthorPublisher');

    let authors;
    if (Array.isArray(book.authors)) {
    authors = Array.from(book.authors); 
    } else {
        authors = ['Unknown'];
    }
    const spanBookAuthorPublisherEl = document.createElement('span');
    spanBookAuthorPublisherEl.textContent = `by ${authors.join(', ')} | Publisher: ${book.publisher}`;

    const pBookDescriptionEl = document.createElement('p');
    pBookDescriptionEl.textContent = book.description;
    pBookDescriptionEl.classList.add('bookDescription');  

    const divLanguagePagesPreviewEl = document.createElement('div');
    divLanguagePagesPreviewEl.classList.add('languagePagesPreview');
    
    const divLanguagePagesEl = document.createElement('div');
    divLanguagePagesEl.classList.add('languagePages');
 
    const btnEl = document.createElement('button');
    btnEl.textContent = 'Want to Read'
    btnEl.classList.add('wantToRead')
    btnEl.addEventListener('click', toggleWantToRead)

    const divLanguageEl = document.createElement('div');
    const divPagesEl = document.createElement('div');
    const divPreviewLinkEl = document.createElement('div');
    
    const aPreviewLinkEl = document.createElement('a');
    aPreviewLinkEl.target = "_blank";

    const iLanguageEl = document.createElement('i');
    iLanguageEl.classList.add('fa-solid', 'fa-language');

    const iPagesEl = document.createElement('i');
    iPagesEl.classList.add('fa-regular', 'fa-file-lines');

    const iPreviewEl = document.createElement('i');
    iPreviewEl.classList.add('fa-solid', 'fa-link')

    const divBookCategoryEl = document.createElement('div');
    divBookCategoryEl.textContent = book.category;
    divBookCategoryEl.classList.add('bookCategory');


    divCategoriesContEl.appendChild(divBookCategoryEl);   

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
    favBtn.appendChild(iRegularHeart)
    favBtn.appendChild(iSolidHeart)

    favBtn.addEventListener('click', toggleAddToFavorites);

    appendToMainCategoryComponent(articleEl, book.category)
}

function appendToMainCategoryComponent(cardElement, bookCategory) {
     if (bookCategory === "Search Result") {
        const searchResultsEl = document.getElementById("searchResults");
        searchResultsEl.appendChild(cardElement);

        const parentResultEl = searchResultsEl.parentElement;
        const sectionCat = document.getElementById('categories');
        parentResultEl.style.display = 'flex';
        sectionCat.style.display = 'none';
        
        return;
    }
    
    const categoryElement = document.getElementById(bookCategory);
    if (categoryElement) {
        categoryElement.appendChild(cardElement);
    }
}


function toggleAddToFavorites(e) {
    const btnEl = e.currentTarget;
    const regularHeartEl = btnEl.querySelector('.regular-heart');
    const solidHeartEl = btnEl.querySelector('.solid-heart');
   
    const titleHeartContEL = btnEl.parentElement;
    const titleEl = titleHeartContEL.querySelector('h3');
    const bookMetaRightEl = titleHeartContEL.parentElement;
    const bookInfoContEl = bookMetaRightEl.parentElement;
    const imgEl = bookInfoContEl.querySelector('img');
    
    const ulListEL = document.getElementById('favoritesList')
    const bookId = titleEl.textContent;
    
    let existingLiEl = ulListEL.querySelectorAll(`li[data-id="${bookId}"]`)

    const children = btnEl.children;
    if (!children[0].classList.contains('hidden')) {
        solidHeartEl.classList.remove('hidden')
        regularHeartEl.classList.add('hidden')

        createAppendNewLiEL(ulListEL, bookId, imgEl.src, titleEl.textContent)

        } else {
            solidHeartEl.classList.add('hidden')
            regularHeartEl.classList.remove('hidden')

            existingLiEl[0].remove();
        }
}

const dropdownButtons = document.querySelectorAll('.listBtn');

dropdownButtons.forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation(); // prevent event from bubbling

    const menuId = btn.dataset.target;
    console.log(menuId)
    const menu = document.getElementById(menuId);

    // closes other dropdowns
    document.querySelectorAll('.dropdownMenu').forEach(m => {
      if (m !== menu) m.hidden = true;
    });

    // Toggle the clicked menu
    menu.hidden = !menu.hidden;
  });
});


function toggleWantToRead(e) {
    const btnEl = e.target;
    const parentEl = btnEl.parentElement; /* div class='bookMetaRight' */
    const titleEl = parentEl.querySelector('h3');
    const containerEl = parentEl.parentElement; /* div class='bookInfo' */
    const imgCoverEl = containerEl.querySelector('.bookMetaLeft img');
    const ulListEL = document.getElementById('wantList');
     
    const bookId = titleEl.textContent;

    let existingLiEl = ulListEL.querySelectorAll(`li[data-id="${bookId}"]`)

    if (btnEl.textContent === 'Want to Read') {
        
        if (existingLiEl.length === 0) {
           createAppendNewLiEL(ulListEL, bookId, imgCoverEl.src, titleEl.textContent)
        }

        btnEl.textContent = "Added to Book List";
    } else {
        if (existingLiEl) {
            existingLiEl[0].remove();
        }
        btnEl.textContent = "Want to Read";
    }   
    
}

// Close dropdowns if clicking outside
document.addEventListener('click', () => {
  document.querySelectorAll('.dropdownMenu').forEach(menu => menu.hidden = true);
});

function createAppendNewLiEL(toAppendTo, bookId, imgSrc, bookTitle) {
    const newLiEl = document.createElement('li');
    newLiEl.dataset.id = bookId;

    const newImgEl = document.createElement('img');
    newImgEl.src = imgSrc;

    const newPEl = document.createElement('p');
    // newPEl.classList.add('title');
    newPEl.textContent = bookTitle;

    newLiEl.appendChild(newImgEl);
    newLiEl.appendChild(newPEl);

    toAppendTo.appendChild(newLiEl);

}; 
