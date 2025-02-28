const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    //books_string = JSON.stringify(books, "", 4);
    //return res.status(300).json({message: `available books are ${books_string}`});

     // Convert the books into an array for better handling
     const booksArray = Object.values(books);

     // Create a structured response
     const response = {
         totalBooks: booksArray.length,
         books: booksArray.map(book => ({
             id: book.id,
             author: book.author,
             title: book.title,
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
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
