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
retrieveBooksByCategory()

async function retrieveBooksByCategory() {
    const query = encodeURIComponent('subject:fiction'); 
    /* encodeURIComponent function that encodes a string so 
    it can be used as a URL query param */

    /* api endpoint for 6 books */
    const apiURL = `https://www.googleapis.com/books/v1/volumes?q=${query}&printType=books&orderBy=relevance&maxResults=6`;
    const res = await fetch(apiURL);

    const data = await res.json()
    const books = data.items; 

    extractBookInfo(books);
    
}

function extractBookInfo(rawItems) {
    
    for (const item of rawItems) {
        const bookObject = {
            title: item.volumeInfo.title,
            authors: item.volumeInfo.authors,
            publisher: item.volumeInfo.publisher,
            description: item.volumeInfo.description,
            categories: item.volumeInfo.categories,
            language: item.volumeInfo.language,
            previewLink: item.volumeInfo.previewLink,
            imageLink: item.volumeInfo.imageLink,
            avgRating: item.volumeInfo.avgRating,
            ratingsCount: item.volumeInfo.ratingsCount,
            pageCount: item.volumeInfo.pageCount,
        };
        createBookCard(bookObject) 
    }

}

function createBookCard(book) {
    const articleEl = document.createElement('article');
    const imgEl = document.createElement('img');

//     const divCollectionEL = document.createElement('div');
//     const h3El = document.createElement('h3');
//     const pAuthorEl = document.createElement('p');
//     const pAuthorEl = document.createElement('p');
//     const pAuthorEl = document.createElement('p');
//     const pAuthorEl = document.createElement('p');
//     const pAuthorEl = document.createElement('p');
// 
}