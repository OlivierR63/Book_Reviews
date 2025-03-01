const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ 
    // Use filter to check if a user with the same username exists
    filtered_user = users.filter((user)=>user.username === username);

    // Return true if a user with the same username is found, otherwise false
    return filtered_user.length > 0;
}

const authenticatedUser = (username,password)=>{ 
    // First check if the user is valid
    if (isValid(username))
    {
        // Filter users to find a match with username and password
        const auth_user = users.filter((user)=>user.username===username && user.password === password);
    
        //The double negative (!!) technique is commonly used in JavaScript to convert a value to a boolean.
        // Returns true if an authenticated user is found, otherwise false
        return !!auth_user;
    }
    
    return false;
}

// Only registered users can login
regd_users.post("/login", (req,res) => {
    username = req.body.username;
    password = req.body.password;

    if (authenticatedUser(username, password))
    {
        // Generate JWT access token
        const accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60*60 }); // Validity expires one hour (60*60s = 3600s) after token generation.

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
        if (review && review.length > 0) {
            book.reviews[username] = review; // Add the review to the book's reviews object
            return res.status(200).json({ message: "Review posted successfully" });
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

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
