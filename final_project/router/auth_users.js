const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ 
    // Use find to check if a user with the same username exists
    found_user = users.find((user)=>user.username === username);

    // Return true if a user with the same username is found, otherwise false
    return found_user !== undefined;
}

const authenticatedUser = (username,password)=>{ 
    // First check if the user is valid
    if (isValid(username))
    {
        // Use find to check if a user with the same username and password exists
        const auth_user = users.find((user)=>user.username===username && user.password === password);
    
        //The double negative (!!) technique is commonly used in JavaScript to convert a value to a boolean.
        // Returns true if an authenticated user is found, otherwise false
        return !!auth_user;
    }
    
    return false;
}

// Only registered users can login
regd_users.post("/login", (req,res) => {
    let username = req.body.username;
    let password = req.body.password;

    if (authenticatedUser(username, password))
    {
        // Generate JWT access token
        const accessToken = jwt.sign(
            {"username": username},
            'access',
            { expiresIn: 60*60 }); // Validity expires one hour (60*60s = 3600s) after token generation.

        // Store access token and username in session
        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("User successfully logged in");
    }
    else
    {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    };
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.body.review; // Make sure the request body contains a 'review' field
    const username=req.user.username; // Use the attached user object when authenticating
    const book=books[isbn];

    if (book)
    {
        if (review && review.trim().length > 0) {
            book.reviews = book.reviews || {};   // Make sure the reviews is not filled only with blank spaces.
            book.reviews[username] = review; // Add the review to the book's reviews object
            return res.status(200).json({message: `The key/value pair "${username}:${review}"has been added to this book's commentsThe review "${review}" has been posted successfully`});
        } 
        else 
        {
            return res.status(400).json({ message: "Review cannot be empty" });
        }
    } 
    else 
    {
        return res.status(404).json({ message: "Book not found" });
    }
});

// Delete a book
regd_users.delete("/auth/review/:isbn", (req, res)=>{
    let isbn = req.params.isbn;
    let book = books[isbn];

    if (book)
    {
        const userName = req.user.username;

        if (book.reviews && book.reviews[userName])
        {
            delete book.reviews[userName]; // Delete the specified user's review
            return res.status(200).json({ message: `Reviews from user ${userName} related to book ${isbn} deleted successfully` });
        }
        else
        {
            return res.status(400).json({ message: "No review found for this user" });
        }
    }
    else
    {
        return res.status(404).json({ message: "Book not found" });
    }
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
