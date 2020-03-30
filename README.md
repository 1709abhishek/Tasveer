# Tasveer
A basic user registration and authentication website, if there are max 3 request in a day, then google recaptcha used.

# Dependencies Used

1. express
2. request-flash
3. body-parser
4. express-ejs-layouts
5. request-ip
6. nodemon
7. express-sessions
8. Mongoose
9. Google-recaptcha
10. cookie-parser

# Routes
1. home : / 
2. Users : /users : /profile : To show profile page
                  : /sign-in : To show sign-in page
                  : /sign-up : To show Sign-up page
                  : /create : To create user
                  : /create-session : To start user session with cookie

# Controller
1. home
2. signIn, signUp, create, createSession, profile

# clone the project and do cd tasveer and start server by nodemon index.js

---- # have made sign-in as a testing unit also. although not added complete functionalities and sign-out. ----
---- # have made manual authentication with cookie-parser maintaining cookies. -----
---- # also made a profile page. -----

# can do to improve:
1. passportjs auth
2. google oauth
3. some minor bugs
4. bugs in profile page