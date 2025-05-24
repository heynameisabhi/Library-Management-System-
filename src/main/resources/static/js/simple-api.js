/**
 * simple-api.js - A simple client-side API for the Library Management System
 * This file provides mock API endpoints for testing the UI without a backend
 */

// Create a namespace for our API
const LibraryAPI = {
    // In-memory database
    data: {
        books: [
            { id: 1, title: "The Great Gatsby", author: "F. Scott Fitzgerald", availability: true },
            { id: 2, title: "To Kill a Mockingbird", author: "Harper Lee", availability: true },
            { id: 3, title: "1984", author: "George Orwell", availability: true },
            { id: 4, title: "Pride and Prejudice", author: "Jane Austen", availability: true },
            { id: 5, title: "The Catcher in the Rye", author: "J.D. Salinger", availability: true }
        ],
        members: [
            { id: 1, name: "John Doe", email: "john@example.com" },
            { id: 2, name: "Jane Smith", email: "jane@example.com" },
            { id: 3, name: "Bob Johnson", email: "bob@example.com" },
            { id: 4, name: "Alice Williams", email: "alice@example.com" },
            { id: 5, name: "Charlie Brown", email: "charlie@example.com" }
        ],
        staff: [
            { id: 1, name: "Admin User", role: "Administrator" },
            { id: 2, name: "Librarian", role: "Librarian" }
        ],
        transactions: []
    },
    
    // Get all books
    getBooks: function() {
        return Promise.resolve([...this.data.books]);
    },
    
    // Get a book by ID
    getBook: function(id) {
        const book = this.data.books.find(book => book.id === parseInt(id));
        return Promise.resolve(book || null);
    },
    
    // Get all members
    getMembers: function() {
        return Promise.resolve([...this.data.members]);
    },
    
    // Get a member by ID
    getMember: function(id) {
        const member = this.data.members.find(member => member.id === parseInt(id));
        return Promise.resolve(member || null);
    },
    
    // Get all staff
    getStaff: function() {
        return Promise.resolve([...this.data.staff]);
    },
    
    // Get a staff member by ID
    getStaffMember: function(id) {
        const staffMember = this.data.staff.find(staff => staff.id === parseInt(id));
        return Promise.resolve(staffMember || null);
    },
    
    // Get all transactions
    getTransactions: function() {
        return Promise.resolve([...this.data.transactions]);
    },
    
    // Issue a book
    issueBook: function(bookId, memberId, staffId, dueDate) {
        return new Promise((resolve, reject) => {
            // Validate inputs
            if (!bookId || !memberId || !staffId || !dueDate) {
                return reject(new Error("Missing required fields"));
            }
            
            // Find the book
            const book = this.data.books.find(book => book.id === parseInt(bookId));
            if (!book) {
                return reject(new Error(`Book with ID ${bookId} not found`));
            }
            
            // Check if the book is available
            if (!book.availability) {
                return reject(new Error(`Book "${book.title}" is not available`));
            }
            
            // Find the member
            const member = this.data.members.find(member => member.id === parseInt(memberId));
            if (!member) {
                return reject(new Error(`Member with ID ${memberId} not found`));
            }
            
            // Find the staff member
            const staff = this.data.staff.find(staff => staff.id === parseInt(staffId));
            if (!staff) {
                return reject(new Error(`Staff with ID ${staffId} not found`));
            }
            
            // Create a new transaction
            const transaction = {
                id: this.data.transactions.length + 1,
                book_id: parseInt(bookId),
                member_id: parseInt(memberId),
                staff_id: parseInt(staffId),
                date_borrowed: new Date().toISOString().split('T')[0],
                due_date: dueDate,
                return_date: null,
                fine: 0,
                book: book,
                member: member,
                staff: staff
            };
            
            // Update book availability
            book.availability = false;
            
            // Add the transaction to the database
            this.data.transactions.push(transaction);
            
            // Return the transaction
            resolve(transaction);
        });
    },
    
    // Return a book
    returnBook: function(transactionId) {
        return new Promise((resolve, reject) => {
            // Find the transaction
            const transaction = this.data.transactions.find(t => t.id === parseInt(transactionId));
            if (!transaction) {
                return reject(new Error(`Transaction with ID ${transactionId} not found`));
            }
            
            // Check if the book is already returned
            if (transaction.return_date) {
                return reject(new Error("This book has already been returned"));
            }
            
            // Update the transaction
            transaction.return_date = new Date().toISOString().split('T')[0];
            
            // Calculate fine if overdue (assuming $1 per day)
            const dueDate = new Date(transaction.due_date);
            const returnDate = new Date(transaction.return_date);
            if (returnDate > dueDate) {
                const daysOverdue = Math.ceil((returnDate - dueDate) / (1000 * 60 * 60 * 24));
                transaction.fine = daysOverdue;
            }
            
            // Update book availability
            const book = this.data.books.find(book => book.id === transaction.book_id);
            if (book) {
                book.availability = true;
            }
            
            // Return the updated transaction
            resolve(transaction);
        });
    }
};

// Make the API available globally
window.LibraryAPI = LibraryAPI;
