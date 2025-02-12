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
  //Write your code here
  res.send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  const isbn = req.params.isbn;

  if(books[isbn]){
    res.send(books[isbn]);
  } else{
    return res.status(404).json({message:'Book not found'});
  }
  
});

// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  const isMatch = Object.values(books).filter(book => book.author === author);
    if(isMatch.length > 0){
      return res.json(isMatch);
    }
    else{
      return res.status(404).json({message:'Book not found'})
    }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  const istitle = Object.values(books).filter(book => book.title === title);
  if(istitle.length > 0){
    return res.json(istitle);
  }
  else{
    return res.status(404).json({message:'Book Not found'});
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
