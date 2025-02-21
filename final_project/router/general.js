const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }    
    users.push({ "username": username, "password": password });
    return res.status(201).json({ message: "User registered successfully" });
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    // return res.status(200).json(books);
    return res.status(200).send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const filteredbooks = books[isbn];
  if(book) {
    res.status(200).json(book);
  } else {
    res.status(404).json({ message: "Book not found"});
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    const filteredbooks = Object.values(books).filter(
        book => book.author === author
    );
    if(filteredbooks.length > 0) {
        res.status(200).json(filteredbooks);
    } else {
        res.status(404).json({ message: "Book not found"});
    }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    const filteredbooks= Object.values(books).filter(
        book => book.title === title
    );
    if(filteredbooks.length > 0) {
        res.status(200).json(filteredbooks);
    } else {
        res.status(404).json({ message: "Book not found"});
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];
    if (book) {
        return res.status(200).json(book.reviews);
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});

module.exports.general = public_users;
