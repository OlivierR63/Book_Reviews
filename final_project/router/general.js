const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
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

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    // GET function shall work in asynchronous mode
    const get_books = new Promise((resolve, reject) => {
        // Convert the books into an array for better handling
        let booksArray = Object.values(books);

        // Create a structured response
        let response = {
            totalBooks: booksArray.length,
            books: booksArray.map(book => ({
                author: book.author,
                title: book.title,
                review: book.reviews,
                reviewsCount: Object.keys(book.reviews).length // Nombre d'avis
            }))
        };
    
        // Translate the response into a JSON string with indentation.
        const responseString = JSON.stringify(response, null, 4);
        return responseString;
    });

    get_books.then(() =>{
        // Return the response with a status of 300.
        return res.status(200).send(responseString);
    })
    .catch(()=>{
        // Return response with a status of 500 (server side error):
        let errorString = "Unable to get books";
        return res.status(500).send(errorString);
    });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];
    if (book) 
    {
        // If the book is found, return the book details.
        return res.status(200).json({
            isbn: isbn,
            author: book.author,
            title: book.title,
            reviews: book.reviews,
            reviewsCount: Object.keys(book.reviews).length // Number of reviews.
        });
    }
    else
    {
        // If the book is not found, return a 404 status.
        return res.status(404).json({ message: "Book not found" });
    }
    });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const authorName = req.params.author;
    const booksByAuthorArray = Object.values(books).filter((book) => book.author.toLowerCase() === authorName.toLowerCase());

    if (booksByAuthorArray.length > 0) {
        // If books by the author are found, return the book details.
        const response = booksByAuthorArray.map((book, index) => ({
            id: index,
            author: book.author,
            title: book.title,
            reviews: booksByAuthorArray.reviews,
            reviewsCount: Object.keys(book.reviews).length // Number of reviews.
        }));

        return res.status(200).json(response);
    } else {
        // If no books by the author are found, return a 404 status.
        return res.status(404).json({ message: "No books found by this author" });
    }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    const booksByTitleArray = Object.values(books).filter((book) => book.title.toLowerCase() === title.toLowerCase());

    if (booksByTitleArray.length > 0)
    {
        // If book(s) is(are) found by its(their) title(s), return the book(s) details.
        const response = booksByTitleArray.map((book, index) => ({
            author: book.author,
            title: book.title,
            reviewsCount: Object.keys(book.reviews).length // Number of reviews.
        }));

        return res.status(200).json(response);
    }
    else
    {
        // If no books by the author are found, return a 404 status.
        return res.status(404).json({ message: "No books found by this title" });
    }
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
