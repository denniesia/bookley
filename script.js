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

    retrieveBookInfo(books);

}


// function extractBookInfo(rawItem) {
//     for (const book of books) {
//         const title =
//         const author =
//         const publisher =
//         const description =
//         const categories =
//         const language =
//         const previewLink =
//         const imageLink =
//         const avgRating =
//         const ratingsCount =
//         const pages =
//     }
// }