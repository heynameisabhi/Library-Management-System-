// staff-transactions.js - Handles transaction management

document.addEventListener('DOMContentLoaded', function() {
  console.log("Staff transactions script loaded");

  // Initialize the transactions section
  initTransactionsSection();

  // Function to initialize the transactions section
  function initTransactionsSection() {
    console.log("Initializing transactions section...");

    // Get the transaction section element
    const transactionSection = document.getElementById('issuedBooks');

    // Check if the section exists
    if (!transactionSection) {
      console.error("Transaction section not found!");
      return;
    }

    // Load transactions
    loadTransactions();
  }

  // Load transactions from the API
  async function loadTransactions() {
    console.log("Loading transactions...");

    const tableBody = document.getElementById('transactionTableBody');
    if (!tableBody) {
      console.error("Transaction table body not found!");
      return;
    }

    // Show loading message
    tableBody.innerHTML = '<tr><td colspan="7" class="p-4 text-center text-gray-500">Loading transactions...</td></tr>';

    try {
      // For now, just show some sample transactions
      const sampleTransactions = [
        {
          book: { title: "The Great Gatsby" },
          member: { name: "John Doe" },
          date_borrowed: "2023-05-01",
          due_date: "2023-05-15",
          return_date: null,
          fine: 0,
          id: 1
        },
        {
          book: { title: "To Kill a Mockingbird" },
          member: { name: "Jane Smith" },
          date_borrowed: "2023-04-15",
          due_date: "2023-04-29",
          return_date: "2023-04-28",
          fine: 0,
          id: 2
        }
      ];

      // Display the transactions
      displayTransactions(sampleTransactions);
    } catch (error) {
      console.error("Error loading transactions:", error);
      tableBody.innerHTML = '<tr><td colspan="7" class="p-4 text-center text-red-500">Error loading transactions. Please try again.</td></tr>';
    }
  }

  // Display transactions in the table
  function displayTransactions(transactions) {
    console.log("Displaying transactions:", transactions);

    const tableBody = document.getElementById('transactionTableBody');
    if (!tableBody) {
      console.error("Transaction table body not found!");
      return;
    }

    if (!transactions || transactions.length === 0) {
      tableBody.innerHTML = '<tr><td colspan="7" class="p-4 text-center text-gray-500">No transactions found.</td></tr>';
      return;
    }

    // Clear the table
    tableBody.innerHTML = '';

    // Add each transaction to the table
    transactions.forEach(transaction => {
      const row = document.createElement('tr');
      row.className = 'hover:bg-gray-100';

      // Book title
      const titleCell = document.createElement('td');
      titleCell.className = 'p-2 border';
      titleCell.textContent = transaction.book?.title || 'Unknown';
      row.appendChild(titleCell);

      // Member name
      const memberCell = document.createElement('td');
      memberCell.className = 'p-2 border';
      memberCell.textContent = transaction.member?.name || 'Unknown';
      row.appendChild(memberCell);

      // Issued date
      const issuedCell = document.createElement('td');
      issuedCell.className = 'p-2 border';
      issuedCell.textContent = transaction.date_borrowed || 'Unknown';
      row.appendChild(issuedCell);

      // Due date
      const dueCell = document.createElement('td');
      dueCell.className = 'p-2 border';
      dueCell.textContent = transaction.due_date || 'Unknown';
      row.appendChild(dueCell);

      // Return date
      const returnCell = document.createElement('td');
      returnCell.className = 'p-2 border';
      returnCell.textContent = transaction.return_date || 'Not returned';
      row.appendChild(returnCell);

      // Fine
      const fineCell = document.createElement('td');
      fineCell.className = 'p-2 border';
      fineCell.textContent = transaction.fine ? `$${transaction.fine}` : '$0';
      row.appendChild(fineCell);

      // Actions
      const actionsCell = document.createElement('td');
      actionsCell.className = 'p-2 border';

      if (!transaction.return_date) {
        const returnButton = document.createElement('button');
        returnButton.className = 'bg-blue-500 text-white px-2 py-1 rounded text-sm';
        returnButton.textContent = 'Return';
        returnButton.onclick = () => returnBook(transaction.id);
        actionsCell.appendChild(returnButton);
      } else {
        actionsCell.textContent = 'Returned';
      }

      row.appendChild(actionsCell);

      // Add the row to the table
      tableBody.appendChild(row);
    });
  }

  // Return a book
  function returnBook(transactionId) {
    console.log("Returning book with transaction ID:", transactionId);

    // For now, just show an alert
    alert(`Book returned successfully! (Transaction ID: ${transactionId})`);

    // Reload transactions
    loadTransactions();
  }

  // Set up search functionality
  const searchInput = document.getElementById('searchTransaction');
  if (searchInput) {
    searchInput.addEventListener('input', function(event) {
      const searchTerm = event.target.value.toLowerCase();
      console.log("Searching for:", searchTerm);

      // For now, just reload all transactions
      // In a real implementation, you would filter the transactions based on the search term
      loadTransactions();
    });
  }
});
