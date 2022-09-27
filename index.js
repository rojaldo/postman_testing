// Express app to manage the API for a library of books

// Import the express module
const express = require('express');

// Create an express app
const app = express();

// Import the body-parser module
const bodyParser = require('body-parser');

// Import the Book model
const Book = require('./models/book');

// Import the User model
const User = require('./models/user');

//List of books
let books = [];

// list of users
let users = [];

// Configure the app to use bodyParser()
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Set the port
const port = process.env.PORT || 8080;

// Create a router for the API
const router = express.Router();

// Middleware to use for all requests
router.use((req, res, next) => {
    // Do logging
    console.log('Something is happening.');
    next();
});

// Test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', (req, res) => {
    res.json({ message: 'hooray! welcome to our api!' });
});

router.get('/books', (req, res) => {
    // return all books from list
    res.json(books);

});

router.post('/books', (req, res) => {
    const book = new Book(req.body.title, req.body.author, books.length);
    books.push(book);
    // return response
    res.json({ message: 'Book created!' });
});

router.put('/books/:book_id', (req, res) => {
    // update book
    const book = books.find((book) => book.id === parseInt(req.params.book_id));
    book.title = req.body.title;
    book.author = req.body.author;
    // return response
    res.json({ message: 'Book updated!' });
});

router.patch('/books/:book_id', (req, res) => {
    // update book
    const book = books.find((book) => book.id === parseInt(req.params.book_id));
    book.title = req.body.title;
    book.author = req.body.author;
    // return response
    res.json({ message: 'Book updated!' });
});

router.delete('/books/:book_id', (req, res) => {
    // delete the book from the list of books
    let length = books.length;
    books = books.filter((book) => book.id !== parseInt(req.params.book_id));
    // return response if successful
    if (length > books.length) {
        res.json({ message: 'Book deleted!' });
    }
    else {
        // return response if not successful (book not found) with 404 status code
        res.status(404).json({ message: 'Book not found!' });

    }


});

// list Users
router.get('/users', (req, res) => {
    // return all users from list
    res.json(users);

});

// function checkAuth(req) returns true if the user is authenticated
function checkAuth(req) {
    // check if the user is authenticated
    if(req.headers.authorization && req.headers.authorization.search('Basic ') === 0) {
        // fetch login and password
        const b64auth = (req.headers.authorization || '').split(' ')[1] || '';
        const [login, password] = new Buffer(b64auth, 'base64').toString().split(':');
        if (login === 'admin' && password === 'admin') 
            return true;
        else
            return false;
    }
    else
        return false;
}


// create user if basic authentication is successful
router.post('/users', (req, res) => {
    // authenticate user
    if (checkAuth(req)) {

    // check if user exists
    const user = users.find((user) => user.name === req.body.name);
    if (user) {
        // return response if user exists
        res.status(409).json({ message: 'User already exists!' });
    }
    else {
        // create user
        const user = new User(req.body.name, users.length);
        users.push(user);
        // return response
        res.json({ message: 'User created!' });
    }
}
else {
    // return response if authentication fails
    res.status(401).json({ message: 'Authentication failed!' });
}
});

// update user if basic authentication is successful
router.put('/users/:user_id', (req, res) => {
    // authenticate user
    if (checkAuth(req)) {
    // update user
    const user = users.find((user) => user.id === parseInt(req.params.user_id));
    user.name = req.body.name;
    // return response
    res.json({ message: 'User updated!' });
}
else {
    // return response if authentication fails
    res.status(401).json({ message: 'Authentication failed!' });
}
});

// delete user if basic authentication is successful
router.delete('/users/:user_id', (req, res) => {
    // authenticate user
    if (checkAuth(req)) {
    // delete the user from the list of users
    let length = users.length;
    users = users.filter((user) => user.id !== parseInt(req.params.user_id));
    // return response if successful
    if (length > users.length) {
        res.json({ message: 'User deleted!' });
    }
    else {
        // return response if not successful (user not found) with 404 status code
        res.status(404).json({ message: 'User not found!' });

}
}
else {
    // return response if authentication fails
    res.status(401).json({ message: 'Authentication failed!' });
}
});

    


// Register the routes
app.use('/api/v0', router);

// Start the server

app.listen(port);
console.log('Magic happens on port ' + port);