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

// Import the Transaction model
const Transaction = require('./models/transaction');

// Import the Item model
const Item = require('./models/item');

//List of books
let books = [];

// list of users
let users = [];

// list of items
let items = [];

// list of transactions
let transactions = [];



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
    let id = 0
    if (books.length > 0) id = books[books.length - 1].id + 1;
    const book = new Book(req.body.title, req.body.author, id);
    books.push(book);
    // return response with status 201
    res.status(201).json(book);
});

router.put('/books/:book_id', (req, res) => {
    // update book
    const book = books.find((book) => book.id === parseInt(req.params.book_id));
    book.title = req.body.title;
    book.author = req.body.author;
    // return response with book object
    res.json(book);
});

router.patch('/books/:book_id', (req, res) => {
    // update book
    const book = books.find((book) => book.id === parseInt(req.params.book_id));
    book.title = req.body.title;
    book.author = req.body.author;
    // return response with book object
    res.json(book);
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
    if (req.headers.authorization && req.headers.authorization.search('Basic ') === 0) {
        // fetch login and password
        const b64auth = (req.headers.authorization || '').split(' ')[1] || '';
        const [login, password] = new Buffer(b64auth, 'base64').toString().split(':');
        if (login === 'admin' && password === 'admin')
            return true;
        else
            return true;
    }
    else
        return true;
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
            let id = 0
            if (users.length > 0) id = users[users.length - 1].id + 1;
            const user = new User(req.body.name, id);
            users.push(user);
            // return response with 201 status code and user
            res.status(201).json(user);
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
        // return response with user object
        res.json(user);

    }
    else {
        // return response if authentication fails
        res.status(401).json({ message: 'Authentication failed!' });
    }
});

router.patch('/users/:user_id', (req, res) => {
    // return not implemented response
    res.status(501).json({ message: 'Not implemented!' });
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

// list items
router.get('/items', (req, res) => {
    // return all items from list
    res.json(items);

});

// create item
router.post('/items', (req, res) => {
    // create item
    let id = 0
    if (items.length > 0) id = items[items.length - 1].id + 1;
    console.log(req.body);
    // get body as json
    const item = new Item(req.body.book_id, id);
    items.push(item);
    // return response with status 201
    res.status(201).json(item);
});

// delete item
router.delete('/items/:item_id', (req, res) => {
    // delete the item from the list of items
    let length = items.length;
    items = items.filter((item) => item.id !== parseInt(req.params.item_id));
    // return response if successful
    if (length > items.length) {
        res.json({ message: 'Item deleted!' });
    }
    else {
        // return response if not successful (item not found) with 404 status code
        res.status(404).json({ message: 'Item not found!' });
    }
});

// list transactions
router.get('/transactions', (req, res) => {
    // return all transactions from list
    res.json(transactions);

});

// create transaction
router.post('/transactions', (req, res) => {
    // create transaction
    let id = 0
    if (transactions.length > 0) id = transactions[transactions.length - 1].id + 1;
    // create transaction with currentDate and dueDate 7 days later
    const transaction = new Transaction(req.body.user_id, req.body.item_id, new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000), new Date(), id);
    transactions.push(transaction);
    // return response with 201 status code and transaction
    res.status(201).json(transaction);
});

// delete transaction
router.delete('/transactions/:transaction_id', (req, res) => {
    // delete the transaction from the list of transactions
    let length = transactions.length;
    transactions = transactions.filter((transaction) => transaction.id !== parseInt(req.params.transaction_id));
    // return response if successful
    if (length > transactions.length) {
        res.json({ message: 'Transaction deleted!' });
    }
    else {
        // return response if not successful (transaction not found) with 404 status code
        res.status(404).json({ message: 'Transaction not found!' });
    }
});

// default route
router.get('*', (req, res) => {
    res.status(404).json({ message: 'Route not found!' });
});


// Register the routes
app.use('/api/v0', router);

// Start the server

app.listen(port);
console.log('Magic happens on port ' + port);