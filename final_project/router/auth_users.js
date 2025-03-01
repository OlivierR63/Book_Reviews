const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ 
    rtrn_value = false;
    filtered_user = users.filter((user)=>{
        user.username === username;
    });

    if (filtered_user) {
        rtrn_value = true;
    }
    return rtrn_value;
}

const authenticatedUser = (username,password)=>{ 
    rtrn_value = false;

    if (isValid(username))
    {
        auth_user = users.filter((user)=>{
            user.username===username && user.password === password;
            if (auth_user)
            {
                rtrn_value=true;
            }
        });
        return rtrn_value;
    }

//only registered users can login
regd_users.post("/login", (req,res) => {
    username = req.params.username;
    password = req.params.password;

    if (authenticatedUser(username, password)){
        // Generate JWT access token
        let accessToken = jwt.sign({
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
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
