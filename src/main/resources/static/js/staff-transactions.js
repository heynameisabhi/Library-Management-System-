// staff-transactions.js - Handles book issuing, returning, and transaction management

export function setupTransactionManagement() {
  console.log("Setting up transaction management...");
  // API endpoints
  const TRANSACTIONS_API = '/api/transactions';
  const BOOKS_API = '/api/books';
  const MEMBERS_API = '/api/members';
  const STAFF_API = '/api/staff';

  // Fallback API endpoints (in case the /api/ prefix is not used)
  const FALLBACK_TRANSACTIONS_API = '/transactions';
  const FALLBACK_BOOKS_API = '/books';
  const FALLBACK_MEMBERS_API = '/member';
  const FALLBACK_STAFF_API = '/staff';

  // DOM elements
  const transactionSection = document.getElementById('issuedBooks');
  const transactionTableBody = document.getElementById('transactionTableBody');
  const issueBookForm = document.getElementById('issueBookForm');
  const searchTransactionInput = document.getElementById('searchTransaction');

  // Initialize the transactions section
  function initTransactionsSection() {
    console.log("Initializing transactions section...");

    // Check if the transactionSection element exists
    if (!transactionSection) {
      console.error("Transaction section element not found! ID: issuedBooks");
      alert("Error: Transaction section element not found! Check the console for details.");
      return;
    }

    // Replace the placeholder content with our transaction management UI
    transactionSection.innerHTML = `
      <h2 class="text-2xl font-semibold mb-4">📖 Issued Books</h2>

      <!-- Issue Book Form -->
      <div class="bg-white p-4 rounded shadow mb-6">
        <h3 class="text-lg font-semibold mb-2">Issue a Book</h3>
        <form id="issueBookForm" class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select id="bookSelect" required class="p-2 border rounded">
            <option value="">Select a Book</option>
            <!-- Books will be loaded here -->
          </select>

          <select id="memberSelect" required class="p-2 border rounded">
            <option value="">Select a Member</option>
            <!-- Members will be loaded here -->
          </select>

          <select id="staffSelect" required class="p-2 border rounded">
            <option value="">Select Staff</option>
            <!-- Staff will be loaded here -->
          </select>

          <button type="submit" class="col-span-full bg-green-600 text-white py-2 rounded hover:bg-green-500">
            Issue Book
          </button>
        </form>
      </div>

      <!-- Transactions Table -->
      <div class="bg-white p-4 rounded shadow">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold">Transaction History</h3>
          <input type="text" id="searchTransaction" placeholder="Search transactions..." class="p-2 border rounded" />
        </div>

        <table class="w-full table-auto border-collapse">
          <thead>
            <tr class="bg-gray-200">
              <th class="p-2 border">Book Title</th>
              <th class="p-2 border">Member</th>
              <th class="p-2 border">Issued Date</th>
              <th class="p-2 border">Due Date</th>
              <th class="p-2 border">Return Date</th>
              <th class="p-2 border">Fine</th>
              <th class="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody id="transactionTableBody">
            <!-- Transactions will be loaded here -->
          </tbody>
        </table>
      </div>
    `;

    // Re-get DOM elements after updating the HTML
    issueBookForm = document.getElementById('issueBookForm');
    transactionTableBody = document.getElementById('transactionTableBody');
    searchTransactionInput = document.getElementById('searchTransaction');

    // Load data and set up event listeners
    loadBooks();
    loadMembers();
    loadStaff();
    loadTransactions();
    setupEventListeners();
  }

  // Load available books (only those with availability=true)
  async function loadBooks() {
    const bookSelect = document.getElementById('bookSelect');
    if (!bookSelect) {
      console.error("Book select element not found!");
      return;
    }

    bookSelect.innerHTML = '<option value="">Select a Book</option>';

    // Try primary API endpoint first, then fallback
    let books = [];
    let success = false;

    // Try primary endpoint
    try {
      console.log("Fetching books from primary endpoint:", BOOKS_API);
      const response = await fetch(BOOKS_API);
      if (response.ok) {
        books = await response.json();
        console.log("Books received from primary endpoint:", books);
        success = true;
      } else {
        console.warn(`Primary endpoint returned status: ${response.status}`);
      }
    } catch (error) {
      console.warn("Error with primary books endpoint:", error);
    }

    // Try fallback endpoint if primary failed
    if (!success) {
      try {
        console.log("Fetching books from fallback endpoint:", FALLBACK_BOOKS_API);
        const fallbackResponse = await fetch(FALLBACK_BOOKS_API);
        if (fallbackResponse.ok) {
          books = await fallbackResponse.json();
          console.log("Books received from fallback endpoint:", books);
          success = true;
        } else {
          console.warn(`Fallback endpoint returned status: ${fallbackResponse.status}`);
        }
      } catch (fallbackError) {
        console.error("Error with fallback books endpoint:", fallbackError);
      }
    }

    // If we have books, process them
    if (success && Array.isArray(books) && books.length > 0) {
      // Filter only available books - handle different property names
      const availableBooks = books.filter(book =>
        book.availability === true || book.available === true || book.isAvailable === true
      );

      console.log("Available books:", availableBooks);

      if (availableBooks.length > 0) {
        availableBooks.forEach(book => {
          const option = document.createElement('option');
          // Handle different property names
          option.value = book.book_id || book.bookId || book.id || '';
          option.textContent = `${book.title || 'Unknown'} by ${book.author || 'Unknown'}`;
          bookSelect.appendChild(option);
        });
      } else {
        console.warn("No available books found");
        const option = document.createElement('option');
        option.disabled = true;
        option.textContent = "No available books";
        bookSelect.appendChild(option);
      }
    } else {
      console.error("Failed to load books or empty books array");
      const option = document.createElement('option');
      option.disabled = true;
      option.textContent = "Failed to load books";
      bookSelect.appendChild(option);

      // Add some default books for testing
      const defaultBooks = [
        { id: 1, title: "The Great Gatsby", author: "F. Scott Fitzgerald" },
        { id: 2, title: "To Kill a Mockingbird", author: "Harper Lee" },
        { id: 3, title: "1984", author: "George Orwell" }
      ];

      defaultBooks.forEach(book => {
        const option = document.createElement('option');
        option.value = book.id;
        option.textContent = `${book.title} by ${book.author}`;
        bookSelect.appendChild(option);
      });
    }
  }

  // Load members
  async function loadMembers() {
    const memberSelect = document.getElementById('memberSelect');
    if (!memberSelect) {
      console.error("Member select element not found!");
      return;
    }

    memberSelect.innerHTML = '<option value="">Select a Member</option>';

    // Try primary API endpoint first, then fallback
    let members = [];
    let success = false;

    // Try primary endpoint
    try {
      console.log("Fetching members from primary endpoint:", MEMBERS_API);
      const response = await fetch(MEMBERS_API);
      if (response.ok) {
        members = await response.json();
        console.log("Members received from primary endpoint:", members);
        success = true;
      } else {
        console.warn(`Primary endpoint returned status: ${response.status}`);
      }
    } catch (error) {
      console.warn("Error with primary members endpoint:", error);
    }

    // Try fallback endpoint if primary failed
    if (!success) {
      try {
        console.log("Fetching members from fallback endpoint:", FALLBACK_MEMBERS_API);
        const fallbackResponse = await fetch(FALLBACK_MEMBERS_API);
        if (fallbackResponse.ok) {
          members = await fallbackResponse.json();
          console.log("Members received from fallback endpoint:", members);
          success = true;
        } else {
          console.warn(`Fallback endpoint returned status: ${fallbackResponse.status}`);
        }
      } catch (fallbackError) {
        console.error("Error with fallback members endpoint:", fallbackError);
      }
    }

    // If we have members, process them
    if (success && Array.isArray(members) && members.length > 0) {
      members.forEach(member => {
        const option = document.createElement('option');
        // Handle different property names
        option.value = member.memberid || member.memberId || member.id || '';
        option.textContent = `${member.name || 'Unknown'} (${member.email || member.emailId || 'No email'})`;
        memberSelect.appendChild(option);
      });
    } else {
      console.error("Failed to load members or empty members array");
      const option = document.createElement('option');
      option.disabled = true;
      option.textContent = "Failed to load members";
      memberSelect.appendChild(option);

      // Add some default members for testing
      const defaultMembers = [
        { id: 1, name: "John Doe", email: "john@example.com" },
        { id: 2, name: "Jane Smith", email: "jane@example.com" },
        { id: 3, name: "Bob Johnson", email: "bob@example.com" }
      ];

      defaultMembers.forEach(member => {
        const option = document.createElement('option');
        option.value = member.id;
        option.textContent = `${member.name} (${member.email})`;
        memberSelect.appendChild(option);
      });
    }
  }

  // Load staff
  async function loadStaff() {
    const staffSelect = document.getElementById('staffSelect');
    if (!staffSelect) {
      console.error("Staff select element not found!");
      return;
    }

    staffSelect.innerHTML = '<option value="">Select Staff</option>';

    // Try primary API endpoint first, then fallback
    let staffList = [];
    let success = false;

    // Try primary endpoint
    try {
      console.log("Fetching staff from primary endpoint:", STAFF_API);
      const response = await fetch(STAFF_API);
      if (response.ok) {
        staffList = await response.json();
        console.log("Staff received from primary endpoint:", staffList);
        success = true;
      } else {
        console.warn(`Primary endpoint returned status: ${response.status}`);
      }
    } catch (error) {
      console.warn("Error with primary staff endpoint:", error);
    }

    // Try fallback endpoint if primary failed
    if (!success) {
      try {
        console.log("Fetching staff from fallback endpoint:", FALLBACK_STAFF_API);
        const fallbackResponse = await fetch(FALLBACK_STAFF_API);
        if (fallbackResponse.ok) {
          staffList = await fallbackResponse.json();
          console.log("Staff received from fallback endpoint:", staffList);
          success = true;
        } else {
          console.warn(`Fallback endpoint returned status: ${fallbackResponse.status}`);
        }
      } catch (fallbackError) {
        console.error("Error with fallback staff endpoint:", fallbackError);
      }
    }

    // If we have staff, process them
    if (success && Array.isArray(staffList) && staffList.length > 0) {
      staffList.forEach(staff => {
        const option = document.createElement('option');
        // Handle different property names
        option.value = staff.staffid || staff.staffId || staff.id || '';
        option.textContent = `${staff.name || 'Unknown'} (${staff.role || staff.position || 'Staff'})`;
        staffSelect.appendChild(option);
      });
    } else {
      console.error("Failed to load staff or empty staff array");
      const option = document.createElement('option');
      option.disabled = true;
      option.textContent = "Failed to load staff";
      staffSelect.appendChild(option);

      // Add a default staff option for testing
      const defaultOption = document.createElement('option');
      defaultOption.value = "1";
      defaultOption.textContent = "Default Staff (Admin)";
      staffSelect.appendChild(defaultOption);
    }
  }

  // Load all transactions
  async function loadTransactions() {
    if (!transactionTableBody) {
      console.error("Transaction table body element not found!");
      return;
    }

    // Try primary API endpoint first, then fallback
    let transactions = [];
    let success = false;

    // Try primary endpoint
    try {
      console.log("Fetching transactions from primary endpoint:", TRANSACTIONS_API);
      const response = await fetch(TRANSACTIONS_API);
      if (response.ok) {
        transactions = await response.json();
        console.log("Transactions received from primary endpoint:", transactions);
        success = true;
      } else {
        console.warn(`Primary endpoint returned status: ${response.status}`);
      }
    } catch (error) {
      console.warn("Error with primary transactions endpoint:", error);
    }

    // Try fallback endpoint if primary failed
    if (!success) {
      try {
        console.log("Fetching transactions from fallback endpoint:", FALLBACK_TRANSACTIONS_API);
        const fallbackResponse = await fetch(FALLBACK_TRANSACTIONS_API);
        if (fallbackResponse.ok) {
          transactions = await fallbackResponse.json();
          console.log("Transactions received from fallback endpoint:", transactions);
          success = true;
        } else {
          console.warn(`Fallback endpoint returned status: ${fallbackResponse.status}`);
        }
      } catch (fallbackError) {
        console.error("Error with fallback transactions endpoint:", fallbackError);
      }
    }

    if (success) {
      renderTransactions(transactions);
    } else {
      console.error('Failed to load transactions from any endpoint');
      transactionTableBody.innerHTML = `
        <tr>
          <td colspan="7" class="p-4 text-center text-red-500">Failed to load transactions</td>
        </tr>
      `;
    }
  }

  // Render transactions in the table
  function renderTransactions(transactions) {
    if (!transactionTableBody) {
      console.error("Transaction table body element not found!");
      return;
    }

    transactionTableBody.innerHTML = '';

    if (!transactions || transactions.length === 0) {
      transactionTableBody.innerHTML = `
        <tr>
          <td colspan="7" class="p-4 text-center">No transactions found</td>
        </tr>
      `;
      return;
    }

    transactions.forEach(transaction => {
      const row = document.createElement('tr');
      console.log("Processing transaction:", transaction);

      try {
        // Format dates
        const issuedDate = new Date(transaction.dateborrowed).toLocaleDateString();
        const dueDate = new Date(transaction.duedate).toLocaleDateString();
        const returnDate = transaction.datereturned
          ? new Date(transaction.datereturned).toLocaleDateString()
          : 'Not returned';

        // Determine if the book is returned
        const isReturned = transaction.datereturned !== null;

        // Get book and member info safely
        const bookTitle = transaction.book ? transaction.book.title :
                         (transaction.bookId && transaction.bookId.title ? transaction.bookId.title : 'Unknown Book');

        const memberName = transaction.member ? transaction.member.name :
                          (transaction.memberId && transaction.memberId.name ? transaction.memberId.name : 'Unknown Member');

        const transId = transaction.transactionId || transaction.id || 0;
        const fineAmount = transaction.fineamount || transaction.fine || 0;

        row.innerHTML = `
          <td class="p-2 border">${bookTitle}</td>
          <td class="p-2 border">${memberName}</td>
          <td class="p-2 border">${issuedDate}</td>
          <td class="p-2 border">${dueDate}</td>
          <td class="p-2 border">${returnDate}</td>
          <td class="p-2 border">$${fineAmount}</td>
          <td class="p-2 border">
            ${!isReturned ?
              `<button
                onclick="returnBook(${transId})"
                class="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-400 mr-1"
              >
                Return
              </button>` : ''
            }
            <button
              onclick="deleteTransaction(${transId})"
              class="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-400"
            >
              Delete
            </button>
          </td>
        `;
      } catch (error) {
        console.error("Error rendering transaction:", error, transaction);
        row.innerHTML = `
          <td colspan="7" class="p-2 border text-red-500">
            Error rendering transaction data
          </td>
        `;
      }

      transactionTableBody.appendChild(row);
    });
  }

  // Set up event listeners
  function setupEventListeners() {
    // Issue book form submission
    issueBookForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const bookId = document.getElementById('bookSelect').value;
      const memberId = document.getElementById('memberSelect').value;
      const staffId = document.getElementById('staffSelect').value;

      if (!bookId || !memberId || !staffId) {
        alert('Please select book, member, and staff');
        return;
      }

      try {
        const response = await fetch(`${TRANSACTIONS_API}/issue?bookId=${bookId}&memberId=${memberId}&staffId=${staffId}`, {
          method: 'POST'
        });

        if (response.ok) {
          alert('Book issued successfully!');
          issueBookForm.reset();
          loadBooks(); // Reload books to update availability
          loadTransactions(); // Reload transactions table
        } else {
          const errorData = await response.json().catch(() => null);
          alert(`Failed to issue book: ${errorData?.message || response.statusText}`);
        }
      } catch (error) {
        console.error('Error issuing book:', error);
        alert('Error issuing book. Please try again.');
      }
    });

    // Search transactions
    if (searchTransactionInput) {
      searchTransactionInput.addEventListener('input', async (e) => {
        const searchTerm = e.target.value.toLowerCase();

        try {
          const response = await fetch(TRANSACTIONS_API);
          const transactions = await response.json();

          // Filter transactions based on search term
          const filteredTransactions = transactions.filter(tx =>
            tx.bookId.title.toLowerCase().includes(searchTerm) ||
            tx.memberId.name.toLowerCase().includes(searchTerm)
          );

          renderTransactions(filteredTransactions);
        } catch (error) {
          console.error('Error searching transactions:', error);
        }
      });
    }
  }

  // Return a book
  window.returnBook = async (transactionId) => {
    if (!confirm('Are you sure you want to return this book?')) return;

    try {
      const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD

      const response = await fetch(`${TRANSACTIONS_API}/${transactionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          datereturned: today,
          fineamount: 0 // You could calculate fine based on due date
        })
      });

      if (response.ok) {
        alert('Book returned successfully!');
        loadBooks(); // Reload books to update availability
        loadTransactions(); // Reload transactions table
      } else {
        alert('Failed to return book');
      }
    } catch (error) {
      console.error('Error returning book:', error);
      alert('Error returning book');
    }
  };

  // Delete a transaction
  window.deleteTransaction = async (transactionId) => {
    if (!confirm('Are you sure you want to delete this transaction? This will make the book available again if it was not returned.')) return;

    try {
      const response = await fetch(`${TRANSACTIONS_API}/${transactionId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        alert('Transaction deleted successfully!');
        loadBooks(); // Reload books to update availability
        loadTransactions(); // Reload transactions table
      } else {
        alert('Failed to delete transaction');
      }
    } catch (error) {
      console.error('Error deleting transaction:', error);
      alert('Error deleting transaction');
    }
  };

  // Initialize the section
  initTransactionsSection();
}
