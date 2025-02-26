const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required." });
    }
    const userExists = users.some(user => user.username === username);
    if (userExists) {
        return res.status(400).json({ message: "Username already exists. Choose a different one." });
    }
    users.push({ username, password });
    return res.status(201).json({ message: "User registered successfully!" });
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    res.send(JSON.stringify(books,null,4));
    return res.status(300).json({message: "Yet to be implemented"});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    res.send(books[isbn]);
    return res.status(300).json({message: "Yet to be implemented"});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {

    const author = req.params.author.toLowerCase();

    const bookKeys = Object.keys(books);

    const booksByAuthor = bookKeys
        .map(isbn => books[isbn])
        .filter(book => book.author.toLowerCase() === author);


    if (booksByAuthor.length > 0) {
        return res.json(booksByAuthor);
    } else {
        return res.status(300).json({message: "Yet to be implemented"});    }
    
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title.toLowerCase();
    const bookKeys = Object.keys(books);
    const booksByTitle = bookKeys
        .map(isbn => books[isbn])
        .filter(book => book.title.toLowerCase() === title);
    if (booksByTitle.length > 0) {
        return res.json(booksByTitle);
    } else {
        return res.status(300).json({message: "Yet to be implemented"});
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    if (books[isbn]) {
        return res.json(books[isbn].reviews);
    } else {
        return res.status(300).json({message: "Yet to be implemented"});
    }
});

module.exports.general = public_users;
