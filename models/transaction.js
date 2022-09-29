function Transaction (userId, bookId, dueDate, transactionDate, id) {
    this.id = id;
    this.userId = userId;
    this.bookId = bookId;
    this.dueDate = dueDate;
    this.transactionDate = transactionDate;
}

module.exports = Transaction;