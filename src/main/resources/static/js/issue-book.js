// issue-book.js - Handles book issuing functionality

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log("Issue book script loaded");

    // Get the form element
    const issueBookForm = document.getElementById('issueBookForm');

    // Check if the form exists
    if (!issueBookForm) {
        console.error("Issue book form not found!");
        return;
    }

    // Create hardcoded options for books
    const books = [
        { id: 1, title: "The Great Gatsby", author: "F. Scott Fitzgerald" },
        { id: 2, title: "To Kill a Mockingbird", author: "Harper Lee" },
        { id: 3, title: "1984", author: "George Orwell" }
    ];

    // Create hardcoded options for members
    const members = [
        { id: 1, name: "John Doe", email: "john@example.com" },
        { id: 2, name: "Jane Smith", email: "jane@example.com" },
        { id: 3, name: "Bob Johnson", email: "bob@example.com" }
    ];

    // Create hardcoded options for staff
    const staff = [
        { id: 1, name: "Admin User", role: "Administrator" },
        { id: 2, name: "Librarian", role: "Librarian" }
    ];

    // Get the select elements
    const bookSelect = document.getElementById('bookSelect');
    const memberSelect = document.getElementById('memberSelect');
    const staffSelect = document.getElementById('staffSelect');

    // Check if all select elements exist
    if (!bookSelect || !memberSelect || !staffSelect) {
        console.error("One or more select elements not found!");
        return;
    }

    // Clear existing options
    bookSelect.innerHTML = '<option value="">Select a Book</option>';
    memberSelect.innerHTML = '<option value="">Select a Member</option>';
    staffSelect.innerHTML = '<option value="">Select Staff</option>';

    // Add book options
    books.forEach(book => {
        const option = document.createElement('option');
        option.value = book.id;
        option.textContent = `${book.title} by ${book.author}`;
        bookSelect.appendChild(option);
    });

    // Add member options
    members.forEach(member => {
        const option = document.createElement('option');
        option.value = member.id;
        option.textContent = `${member.name} (${member.email})`;
        memberSelect.appendChild(option);
    });

    // Add staff options
    staff.forEach(staffMember => {
        const option = document.createElement('option');
        option.value = staffMember.id;
        option.textContent = `${staffMember.name} (${staffMember.role})`;
        staffSelect.appendChild(option);
    });

    // Set up form submission
    issueBookForm.addEventListener('submit', function(event) {
        event.preventDefault();
        console.log("Form submitted");

        // Get selected values
        const bookId = bookSelect.value;
        const memberId = memberSelect.value;
        const staffId = staffSelect.value;

        // Validate selections
        if (!bookId || !memberId || !staffId) {
            showMessage("Please select a book, member, and staff member", "error");
            return;
        }

        // Log the transaction data
        const transactionData = {
            book_id: bookId,
            member_id: memberId,
            staffid: staffId,
            date_borrowed: new Date().toISOString().split('T')[0]
        };

        console.log("Transaction data:", transactionData);

        // Show success message
        showMessage("Book issued successfully! (Test mode)", "success");

        // Reset form
        issueBookForm.reset();
    });

    // Function to show messages
    function showMessage(message, type) {
        // Try to find the result div
        const resultDiv = document.getElementById('issueResult');

        if (resultDiv) {
            // Update the result div
            resultDiv.textContent = message;
            resultDiv.className = "mt-4 p-3";

            if (type === "success") {
                resultDiv.classList.add("bg-green-100", "text-green-800");
            } else {
                resultDiv.classList.add("bg-red-100", "text-red-800");
            }

            resultDiv.classList.remove("hidden");
        } else {
            // Fallback to alert
            alert(message);
        }
    }
});
