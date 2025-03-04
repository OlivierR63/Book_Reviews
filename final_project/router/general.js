const express = require('express');
let books = require("./booksdb.js");
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username) =>{
    // Use find to check if a user with the same username exists
    const userWithSameName = users.find((user) => user.username === username);

    // Returns true if a user with the same username is found, otherwise false
    return userWithSameName !== undefined;
}

public_users.post("/register", (req,res) => {
    const userName = req.body.username;
    const password = req.body.password; 

    if(userName && password)
    {
        if (!doesExist(userName))
        {
            users.push({"username":userName, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        }
        else
        {
            return res.status(404).json({message: `An account with name ${userName} already exists`});
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "Unable to register user."});
});

// Get the list of available books in the shop.
public_users.get('/',(req, res)=> {
    const get_books = new Promise((resolve, reject) => {
        try
        {
            // Translate the response into a JSON string with indentation.
            let booksJSON = JSON.stringify(books, null, 4);
            resolve(res.status(200).send(booksJSON));
        }
        catch(error)
        {
            reject(error);
        }
    });

    get_books.then(() =>{
        console.log(`get_books: Promise resolved`);
    })
    .catch((error)=>{
        // Return response with a status of 500 (server side error):
        console.error('Error getting books:', error);
        res.status(500).send("Unable to get list of available books in the shop");
    });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', (req, res)=>{
    let get_book_based_on_isbn = new Promise((resolve, reject)=>{
        try
        {
            let isbn = req.params.isbn;
            let book = books[isbn];

            // If the book is found, return the book details.
            resolve( res.status(200).json({
                isbn: isbn,
                author: book.author,
                title: book.title,
                reviews: book.reviews,
                reviewsCount: Object.keys(book.reviews).length // Number of reviews.
            }));
        }
        catch(error)
        {
            reject(error);
        }
    });

    get_book_based_on_isbn.then(() =>{
        console.log(`get_book_based_on_its_isbn: Promise resolved`);
    })
    .catch((error)=>{
        // Return response with a status of 500 (server side error):
        console.error('Error getting books:', error);
        res.status(500).send("Unable to get book based on its ISBN");
    });
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    let get_book_by_author = new Promise((resolve, reject)=>{
        try
        {
            let authorName = req.params.author;
            let booksByAuthor = Object.entries(books)
                                        .filter(([key,value]) => value.author.toLowerCase() === authorName.toLowerCase());

            if (booksByAuthor.length > 0) {
                // If books by the author are found, return the book details.
                let response = booksByAuthor.map(([index,book]) => ({
                    id: index,
                    author: book.author,
                    title: book.title,
                    reviews: book.reviews,
                    reviewsCount: Object.keys(book.reviews).length // Number of reviews.
                }));

                resolve(res.status(200).json(response));
            } 
            else 
            {
                // If no books by the author are found, reject the promise.
                reject(new Error(`No books from ${authorName} found.`));
            }
        }
        catch(error)
        {
            // If no books by the author are found, return a 404 status.
            reject(error);
        }
    });

    get_book_by_author.then(()=>{
        console.log(`get_book_by_author: Promise resolved`);
    })
    .catch((error)=>{
        console.error(`Error getting books:  ${error}`);
        res.status(500).send(`Unable to get book from this author : ${req.params.author}`);
    });
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    let get_book_by_title = new Promise((resolve, reject)=>{
        try
        {
            let title = req.params.title;
            let booksByTitle = Object.entries(books)
                                    .filter(([key,value]) => value.title.toLowerCase() === title.toLowerCase());

            if (booksByTitle.length > 0)
            {
                // If book(s) is(are) found by its(their) title(s), return the book(s) details.
                let response = booksByTitle.map(([index, book]) => ({
                    id: index,
                    author: book.author,
                    title: book.title,
                    reviewsCount: Object.keys(book.reviews).length // Number of reviews.
                }));

                resolve(res.status(200).json(response));
            }
            else
            {
                // If no books are found, return a 404 status.
                reject(new Error(`No books whose title is ${title} has been found`));
            }
        }
        catch(error)
        {
            // If no books are found, return a 404 status.
            reject(error);
        }
    });

    get_book_by_title.then(()=>{
                        console.log(`get_book_based_by_title: Promise resolved`);
                    })
                    .catch((error)=>{
                        console.error(`Error getting books:  ${error}`);
                        res.status(500).send(`Unable to get book having this title : ${req.params.title}`);
                    });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];
    if (book) 
    {
        // If the book is found, return the book details.
        return res.status(200).json({
            reviews: Object.values(book.reviews)
        });
    }
    else
    {
        // If the book is not found, return a 404 status.
        return res.status(404).json({ message: "Book not found" });
    }
});

module.exports.general = public_users;
