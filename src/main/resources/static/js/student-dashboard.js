// Student Dashboard JavaScript
console.log('Student Dashboard JavaScript loaded');

// Global variables
let readingChart = null;

// Load dashboard data
function loadDashboardData() {
  console.log('Loading dashboard data...');
  
  // Load student statistics
  loadStudentStats();
  
  // Load recent activity
  loadRecentActivity();
  
  // Load reading activity chart
  loadReadingActivityChart();
}

// Load student statistics
async function loadStudentStats() {
  try {
    if (!currentStudent || !currentStudent.memberid) {
      console.error('No current student data available');
      return;
    }

    // Fetch student's transactions
    const response = await fetch('/api/transactions');
    if (!response.ok) throw new Error('Failed to fetch transactions');
    
    const allTransactions = await response.json();
    
    // Filter transactions for current student
    const studentTransactions = allTransactions.filter(t => 
      t.memberid === currentStudent.memberid
    );
    
    // Calculate statistics
    const borrowed = studentTransactions.filter(t => t.status === 'ACTIVE').length;
    const returned = studentTransactions.filter(t => t.status === 'COMPLETED').length;
    
    // Calculate due soon and overdue
    const today = new Date();
    const dueSoon = studentTransactions.filter(t => {
      if (t.status !== 'ACTIVE') return false;
      const dueDate = new Date(t.duedate);
      const diffTime = dueDate - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 3 && diffDays >= 0;
    }).length;
    
    const overdue = studentTransactions.filter(t => {
      if (t.status !== 'ACTIVE') return false;
      const dueDate = new Date(t.duedate);
      return dueDate < today;
    }).length;
    
    // Update UI
    document.getElementById('borrowedCount').textContent = borrowed;
    document.getElementById('returnedCount').textContent = returned;
    document.getElementById('dueSoonCount').textContent = dueSoon;
    document.getElementById('overdueCount').textContent = overdue;
    
    console.log('Student stats loaded:', { borrowed, returned, dueSoon, overdue });
    
  } catch (error) {
    console.error('Error loading student stats:', error);
    showNotification('Failed to load statistics', 'error');
  }
}

// Load recent activity
async function loadRecentActivity() {
  try {
    if (!currentStudent || !currentStudent.memberid) return;

    const response = await fetch('/api/transactions');
    if (!response.ok) throw new Error('Failed to fetch transactions');
    
    const allTransactions = await response.json();
    
    // Filter and sort recent transactions for current student
    const recentTransactions = allTransactions
      .filter(t => t.memberid === currentStudent.memberid)
      .sort((a, b) => new Date(b.issuedate) - new Date(a.issuedate))
      .slice(0, 5);
    
    const activityContainer = document.getElementById('recentActivity');
    
    if (recentTransactions.length === 0) {
      activityContainer.innerHTML = `
        <div class="text-center py-8">
          <i class="fas fa-history text-gray-300 text-4xl mb-4"></i>
          <p class="text-gray-500">No recent activity</p>
        </div>
      `;
      return;
    }
    
    // Fetch book details for each transaction
    const booksResponse = await fetch('/api/books');
    const allBooks = await booksResponse.json();
    
    activityContainer.innerHTML = recentTransactions.map(transaction => {
      const book = allBooks.find(b => b.bookid === transaction.bookid);
      const bookTitle = book ? book.title : 'Unknown Book';
      const issueDate = new Date(transaction.issuedate).toLocaleDateString();
      const statusIcon = transaction.status === 'ACTIVE' ? 
        '<i class="fas fa-book-open text-blue-500"></i>' : 
        '<i class="fas fa-check-circle text-green-500"></i>';
      const statusText = transaction.status === 'ACTIVE' ? 'Borrowed' : 'Returned';
      const statusColor = transaction.status === 'ACTIVE' ? 'text-blue-600' : 'text-green-600';
      
      return `
        <div class="flex items-center justify-between py-3 border-b border-gray-200 last:border-b-0">
          <div class="flex items-center space-x-3">
            ${statusIcon}
            <div>
              <p class="font-medium text-gray-900">${bookTitle}</p>
              <p class="text-sm text-gray-500">${issueDate}</p>
            </div>
          </div>
          <span class="text-sm font-medium ${statusColor}">${statusText}</span>
        </div>
      `;
    }).join('');
    
  } catch (error) {
    console.error('Error loading recent activity:', error);
  }
}

// Load reading activity chart
function loadReadingActivityChart() {
  const ctx = document.getElementById('readingActivityChart').getContext('2d');
  
  if (readingChart) {
    readingChart.destroy();
  }
  
  // Sample data - in a real app, this would come from the API
  const monthlyData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'Books Borrowed',
      data: [2, 3, 1, 4, 2, 3],
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      borderColor: 'rgb(59, 130, 246)',
      borderWidth: 2,
      fill: true,
      tension: 0.4
    }]
  };
  
  readingChart = new Chart(ctx, {
    type: 'line',
    data: monthlyData,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1
          }
        }
      }
    }
  });
}

// Load books data
async function loadBooksData() {
  console.log('Loading books data...');
  
  const booksGrid = document.getElementById('booksGrid');
  const booksLoading = document.getElementById('booksLoading');
  const booksEmpty = document.getElementById('booksEmpty');
  const categoryFilter = document.getElementById('categoryFilter');
  
  // Show loading state
  booksLoading.classList.remove('hidden');
  booksGrid.classList.add('hidden');
  booksEmpty.classList.add('hidden');
  
  try {
    const response = await fetch('/api/books');
    if (!response.ok) throw new Error('Failed to fetch books');
    
    allBooks = await response.json();
    
    // Populate category filter
    const categories = [...new Set(allBooks.map(book => book.category))].filter(Boolean);
    categoryFilter.innerHTML = '<option value="">All Categories</option>' + 
      categories.map(cat => `<option value="${cat}">${cat}</option>`).join('');
    
    // Render books
    renderBooks(allBooks);
    
    // Setup search and filter
    setupBooksSearch();
    
  } catch (error) {
    console.error('Error loading books:', error);
    showNotification('Failed to load books', 'error');
    booksEmpty.classList.remove('hidden');
  } finally {
    booksLoading.classList.add('hidden');
  }
}

// Render books grid
function renderBooks(books) {
  const booksGrid = document.getElementById('booksGrid');
  const booksEmpty = document.getElementById('booksEmpty');
  
  if (books.length === 0) {
    booksGrid.classList.add('hidden');
    booksEmpty.classList.remove('hidden');
    return;
  }
  
  booksEmpty.classList.add('hidden');
  booksGrid.classList.remove('hidden');
  
  booksGrid.innerHTML = books.map(book => `
    <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer" onclick="showBookDetails(${book.bookid})">
      <div class="h-48 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
        <i class="fas fa-book text-white text-4xl"></i>
      </div>
      <div class="p-4">
        <h3 class="font-semibold text-gray-900 mb-2 line-clamp-2">${book.title}</h3>
        <p class="text-gray-600 text-sm mb-2">by ${book.author}</p>
        <div class="flex items-center justify-between">
          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            ${book.category || 'General'}
          </span>
          <span class="text-xs text-gray-500">ISBN: ${book.isbn}</span>
        </div>
        <div class="mt-3">
          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            book.status === 'AVAILABLE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }">
            <i class="fas ${book.status === 'AVAILABLE' ? 'fa-check' : 'fa-times'} mr-1"></i>
            ${book.status === 'AVAILABLE' ? 'Available' : 'Not Available'}
          </span>
        </div>
      </div>
    </div>
  `).join('');
}

// Setup books search and filter
function setupBooksSearch() {
  const searchInput = document.getElementById('bookSearch');
  const categoryFilter = document.getElementById('categoryFilter');
  
  function filterBooks() {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedCategory = categoryFilter.value;
    
    let filteredBooks = allBooks;
    
    // Filter by search term
    if (searchTerm) {
      filteredBooks = filteredBooks.filter(book =>
        book.title.toLowerCase().includes(searchTerm) ||
        book.author.toLowerCase().includes(searchTerm) ||
        book.isbn.toLowerCase().includes(searchTerm)
      );
    }
    
    // Filter by category
    if (selectedCategory) {
      filteredBooks = filteredBooks.filter(book => book.category === selectedCategory);
    }
    
    renderBooks(filteredBooks);
  }
  
  searchInput.addEventListener('input', filterBooks);
  categoryFilter.addEventListener('change', filterBooks);
}

// Show book details modal
async function showBookDetails(bookId) {
  const book = allBooks.find(b => b.bookid === bookId);
  if (!book) return;
  
  const modal = document.getElementById('bookDetailsModal');
  const content = document.getElementById('bookDetailsContent');
  const requestBtn = document.getElementById('requestBookBtn');
  
  content.innerHTML = `
    <div class="text-center mb-4">
      <div class="h-32 w-24 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg mx-auto flex items-center justify-center mb-4">
        <i class="fas fa-book text-white text-3xl"></i>
      </div>
      <h4 class="text-lg font-semibold text-gray-900">${book.title}</h4>
      <p class="text-gray-600">by ${book.author}</p>
    </div>
    
    <dl class="space-y-3">
      <div>
        <dt class="text-sm font-medium text-gray-500">ISBN</dt>
        <dd class="mt-1 text-sm text-gray-900">${book.isbn}</dd>
      </div>
      <div>
        <dt class="text-sm font-medium text-gray-500">Category</dt>
        <dd class="mt-1 text-sm text-gray-900">${book.category || 'General'}</dd>
      </div>
      <div>
        <dt class="text-sm font-medium text-gray-500">Availability</dt>
        <dd class="mt-1">
          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            book.status === 'AVAILABLE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }">
            <i class="fas ${book.status === 'AVAILABLE' ? 'fa-check' : 'fa-times'} mr-1"></i>
            ${book.status === 'AVAILABLE' ? 'Available' : 'Not Available'}
          </span>
        </dd>
      </div>
    </dl>
  `;
  
  // Update request button
  if (book.status === 'AVAILABLE') {
    requestBtn.innerHTML = '<i class="fas fa-hand-paper mr-2"></i>Request Book';
    requestBtn.disabled = false;
    requestBtn.className = 'flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition';
    requestBtn.onclick = () => requestBook(book);
  } else {
    requestBtn.innerHTML = '<i class="fas fa-times mr-2"></i>Not Available';
    requestBtn.disabled = true;
    requestBtn.className = 'flex-1 bg-gray-400 text-white py-2 rounded-lg cursor-not-allowed';
    requestBtn.onclick = null;
  }
  
  modal.classList.remove('hidden');
}

// Request book function
async function requestBook(book) {
  try {
    // In a real application, this would create a book request
    // For now, we'll just show a notification
    showNotification(`Book request submitted for "${book.title}"`, 'success');
    document.getElementById('bookDetailsModal').classList.add('hidden');
  } catch (error) {
    console.error('Error requesting book:', error);
    showNotification('Failed to request book', 'error');
  }
}

// Load borrowed books
async function loadBorrowedBooks() {
  console.log('Loading borrowed books...');
  
  try {
    if (!currentStudent || !currentStudent.memberid) return;

    // Fetch transactions and books
    const [transactionsResponse, booksResponse] = await Promise.all([
      fetch('/api/transactions'),
      fetch('/api/books')
    ]);
    
    if (!transactionsResponse.ok || !booksResponse.ok) {
      throw new Error('Failed to fetch data');
    }
    
    const allTransactions = await transactionsResponse.json();
    const allBooks = await booksResponse.json();
    
    // Filter active transactions for current student
    const activeBorrowedTransactions = allTransactions.filter(t => 
      t.memberid === currentStudent.memberid && t.status === 'ACTIVE'
    );
    
    const borrowedBooksList = document.getElementById('borrowedBooksList');
    const borrowedEmpty = document.getElementById('borrowedEmpty');
    
    if (activeBorrowedTransactions.length === 0) {
      borrowedBooksList.classList.add('hidden');
      borrowedEmpty.classList.remove('hidden');
      return;
    }
    
    borrowedEmpty.classList.add('hidden');
    borrowedBooksList.classList.remove('hidden');
    
    // Render borrowed books
    borrowedBooksList.innerHTML = activeBorrowedTransactions.map(transaction => {
      const book = allBooks.find(b => b.bookid === transaction.bookid);
      const bookTitle = book ? book.title : 'Unknown Book';
      const bookAuthor = book ? book.author : 'Unknown Author';
      const issueDate = new Date(transaction.issuedate).toLocaleDateString();
      const dueDate = new Date(transaction.duedate).toLocaleDateString();
      
      // Check if overdue
      const today = new Date();
      const dueDateObj = new Date(transaction.duedate);
      const isOverdue = dueDateObj < today;
      const daysUntilDue = Math.ceil((dueDateObj - today) / (1000 * 60 * 60 * 24));
      
      let dueDateClass = 'text-gray-600';
      let dueDateText = `Due: ${dueDate}`;
      
      if (isOverdue) {
        dueDateClass = 'text-red-600 font-medium';
        dueDateText = `Overdue: ${dueDate}`;
      } else if (daysUntilDue <= 3) {
        dueDateClass = 'text-yellow-600 font-medium';
        dueDateText = `Due Soon: ${dueDate}`;
      }
      
      return `
        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex items-start justify-between">
            <div class="flex items-start space-x-4">
              <div class="h-16 w-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded flex items-center justify-center">
                <i class="fas fa-book text-white text-xl"></i>
              </div>
              <div>
                <h3 class="font-semibold text-gray-900 mb-1">${bookTitle}</h3>
                <p class="text-gray-600 text-sm mb-2">by ${bookAuthor}</p>
                <p class="text-sm text-gray-500">Borrowed: ${issueDate}</p>
                <p class="text-sm ${dueDateClass}">${dueDateText}</p>
              </div>
            </div>
            <div class="flex flex-col items-end space-y-2">
              ${isOverdue ? 
                '<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"><i class="fas fa-exclamation-triangle mr-1"></i>Overdue</span>' :
                daysUntilDue <= 3 ?
                '<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"><i class="fas fa-clock mr-1"></i>Due Soon</span>' :
                '<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"><i class="fas fa-check-circle mr-1"></i>Active</span>'
              }
            </div>
          </div>
        </div>
      `;
    }).join('');
    
  } catch (error) {
    console.error('Error loading borrowed books:', error);
    showNotification('Failed to load borrowed books', 'error');
  }
}

// Load transaction history
async function loadTransactionHistory() {
  console.log('Loading transaction history...');
  
  try {
    if (!currentStudent || !currentStudent.memberid) return;

    // Fetch transactions and books
    const [transactionsResponse, booksResponse] = await Promise.all([
      fetch('/api/transactions'),
      fetch('/api/books')
    ]);
    
    if (!transactionsResponse.ok || !booksResponse.ok) {
      throw new Error('Failed to fetch data');
    }
    
    const allTransactions = await transactionsResponse.json();
    const allBooks = await booksResponse.json();
    
    // Filter transactions for current student
    const studentTransactions = allTransactions
      .filter(t => t.memberid === currentStudent.memberid)
      .sort((a, b) => new Date(b.issuedate) - new Date(a.issuedate));
    
    const historyTableBody = document.getElementById('historyTableBody');
    const historyEmpty = document.getElementById('historyEmpty');
    
    if (studentTransactions.length === 0) {
      historyTableBody.parentElement.parentElement.classList.add('hidden');
      historyEmpty.classList.remove('hidden');
      return;
    }
    
    historyEmpty.classList.add('hidden');
    historyTableBody.parentElement.parentElement.classList.remove('hidden');
    
    // Render history table
    historyTableBody.innerHTML = studentTransactions.map(transaction => {
      const book = allBooks.find(b => b.bookid === transaction.bookid);
      const bookTitle = book ? book.title : 'Unknown Book';
      const bookAuthor = book ? book.author : 'Unknown Author';
      const issueDate = new Date(transaction.issuedate).toLocaleDateString();
      const dueDate = new Date(transaction.duedate).toLocaleDateString();
      const returnDate = transaction.returndate ? new Date(transaction.returndate).toLocaleDateString() : '-';
      
      const statusBadge = transaction.status === 'ACTIVE' ?
        '<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"><i class="fas fa-book-open mr-1"></i>Active</span>' :
        '<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"><i class="fas fa-check-circle mr-1"></i>Returned</span>';
      
      return `
        <tr class="hover:bg-gray-50">
          <td class="px-6 py-4 whitespace-nowrap">
            <div>
              <div class="text-sm font-medium text-gray-900">${bookTitle}</div>
              <div class="text-sm text-gray-500">by ${bookAuthor}</div>
            </div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${issueDate}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${dueDate}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${returnDate}</td>
          <td class="px-6 py-4 whitespace-nowrap">${statusBadge}</td>
        </tr>
      `;
    }).join('');
    
  } catch (error) {
    console.error('Error loading transaction history:', error);
    showNotification('Failed to load transaction history', 'error');
  }
}

// Load profile data
function loadProfileData() {
  console.log('Loading profile data...');
  
  if (!currentStudent) return;
  
  // Update profile information
  document.getElementById('profileName').textContent = currentStudent.name || 'Student Name';
  document.getElementById('profileEmail').textContent = currentStudent.email || 'student@example.com';
  document.getElementById('profilePhone').textContent = currentStudent.phoneNumber || '-';
  document.getElementById('profileAddress').textContent = currentStudent.address || '-';
  document.getElementById('profileMemberId').textContent = currentStudent.memberid || '-';
  
  // Load profile statistics
  loadProfileStats();
}

// Load profile statistics
async function loadProfileStats() {
  try {
    if (!currentStudent || !currentStudent.memberid) return;

    const response = await fetch('/api/transactions');
    if (!response.ok) throw new Error('Failed to fetch transactions');
    
    const allTransactions = await response.json();
    
    // Filter transactions for current student
    const studentTransactions = allTransactions.filter(t => 
      t.memberid === currentStudent.memberid
    );
    
    const totalBorrowed = studentTransactions.length;
    const currentlyBorrowed = studentTransactions.filter(t => t.status === 'ACTIVE').length;
    
    document.getElementById('profileTotalBorrowed').textContent = totalBorrowed;
    document.getElementById('profileCurrentlyBorrowed').textContent = currentlyBorrowed;
    
  } catch (error) {
    console.error('Error loading profile stats:', error);
  }
}

// Notification function
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 max-w-sm ${
    type === 'success' ? 'bg-green-100 text-green-800 border border-green-200' :
    type === 'error' ? 'bg-red-100 text-red-800 border border-red-200' :
    'bg-blue-100 text-blue-800 border border-blue-200'
  }`;
  
  notification.innerHTML = `
    <div class="flex items-center">
      <i class="fas ${
        type === 'success' ? 'fa-check-circle' :
        type === 'error' ? 'fa-exclamation-circle' :
        'fa-info-circle'
      } mr-2"></i>
      <span>${message}</span>
    </div>
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    if (notification.parentNode) {
      notification.parentNode.removeChild(notification);
    }
  }, 5000);
}

// Close modal handlers
document.getElementById('closeBookDetailsBtn').addEventListener('click', () => {
  document.getElementById('bookDetailsModal').classList.add('hidden');
});

document.getElementById('closeBookDetailsBtn2').addEventListener('click', () => {
  document.getElementById('bookDetailsModal').classList.add('hidden');
});

// Close modal when clicking outside
document.getElementById('bookDetailsModal').addEventListener('click', (e) => {
  if (e.target === document.getElementById('bookDetailsModal')) {
    document.getElementById('bookDetailsModal').classList.add('hidden');
  }
});

console.log('Student Dashboard JavaScript initialized');
