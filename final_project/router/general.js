const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username) =>{
    // Filter the users array for any user with the same username
    let usersWithSameName = users.find((user) => {
        return user.username === username;
    });

    // Return true if any user with the same username is found, otherwise false
    if (usersWithSameName.length > 0) {
        return true;
    } else {
        return false;
    }
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
    // Convert the books into an array for better handling
    const booksArray = Object.values(books);

    // Create a structured response
    const response = {
            totalBooks: booksArray.length,
            books: booksArray.map(book => ({
                id: book.id,
                author: book.author,
                title: book.title,
                review: book.reviews,
                reviewsCount: Object.keys(book.reviews).length // Nombre d'avis
            }))
    };
 
    // Translate the response into a JSON string with indentation.
    const responseString = JSON.stringify(response, null, 4);
 
    // Return the response with a status of 300.
    return res.status(200).send(responseString);
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
    const booksByAuthor = Object.entries(books).find(([id, book]) =>
        book.author.toLowerCase() === authorName.toLowerCase()
    );

    if (booksByAuthor.length > 0) {
        // If books by the author are found, return the book details.
        const response = booksByAuthor.map(([id, book]) => ({
            id: id,
            author: book.author,
            title: book.title,
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
    const booksByTitle = Object.entries(books).find(([id, book]) =>
        book.title.toLowerCase() === title.toLowerCase());

    if (booksByTitle.length > 0) {
        // If books by the author are found, return the book details.
        const response = booksByTitle.map(([id, book]) => ({
            id: id,
            author: book.author,
            title: book.title,
            reviewsCount: Object.keys(book.reviews).length // Number of reviews.
        }));

        return res.status(200).json(response);
    } else {
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
            isbn: isbn,
            author: book.author,
            title: book.title,
            reviews: Object.values(book.reviews),
        });
    }
    else
    {
        // If the book is not found, return a 404 status.
        return res.status(404).json({ message: "Book not found" });
    }
});

module.exports.general = public_users;
