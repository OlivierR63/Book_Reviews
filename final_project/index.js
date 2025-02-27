const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",
            session({
                        secret:"fingerprint_customer",
                        resave: true, 
                        saveUninitialized: true
                    }));

app.use("/customer/auth/*", 
            function auth(req,res,next)
            {
                // Check if the user has a session with an authorization token
                if (req.session.authorization && req.session.authorization.accessToken)
                {
                    const token = req.session.authorization.accessToken;

                    // Verify the validity of the JWT token
                    jwt.verify(token, "access_secret_key", (err, user) => {
                        if (!err) {
                            // If the token is valid, attach user information to the request object
                            req.user = user;
                            // Proceed to the next route handler
                            next();
                        } else {
                            // If the token is invalid, send an error response
                            return res.status(403).json({ message: "Invalid or expired token" });
                        }
                    });
                } 
                else
                {
                    // If no token is present, send an error response
                    return res.status(403).json({ message: "User not authenticated" });
                }
            }
        );
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
