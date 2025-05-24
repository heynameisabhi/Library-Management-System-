const API_BASE_URL = "http://localhost:8080/books"; // Change this to your backend URL if different

// Elements
const bookTableBody = document.getElementById("bookTableBody");
const addBookForm = document.getElementById("addBookForm");
const searchBar = document.getElementById("searchBar");

// Fetch and display all books on page load
async function fetchBooks(keyword = "") {
  try {
    let url = API_BASE_URL;
    if (keyword) {
      url += `/search?keyword=${encodeURIComponent(keyword)}`;
    }
    const res = await fetch(url);
    const books = await res.json();

    // Clear current rows
    bookTableBody.innerHTML = "";

    if (books.length === 0) {
      bookTableBody.innerHTML = `<tr><td colspan="5" class="text-center p-4">No books found</td></tr>`;
      return;
    }

    // Add rows
    books.forEach(book => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td class="border px-2 py-1">${book.title}</td>
        <td class="border px-2 py-1">${book.author}</td>
        <td class="border px-2 py-1">${book.isbn}</td>
        <td class="border px-2 py-1">${book.category}</td>
        <td class="border px-2 py-1 text-center space-x-2">
          <button onclick="deleteBook(${book.bookId})" class="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-400">Delete</button>
        </td>
      `;
      bookTableBody.appendChild(tr);
    });
  } catch (err) {
    console.error("Error fetching books:", err);
    bookTableBody.innerHTML = `<tr><td colspan="5" class="text-center p-4 text-red-600">Error loading books</td></tr>`;
  }
}

// Add new book handler
addBookForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const newBook = {
    title: addBookForm.title.value.trim(),
    author: addBookForm.author.value.trim(),
    isbn: addBookForm.isbn.value.trim(),
    genre: addBookForm.category.value.trim(),  // Map category to genre field
    availability: true,  // Set new books as available by default
  };

  try {
    const res = await fetch(API_BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newBook),
    });

    if (res.ok) {
      addBookForm.reset();
      fetchBooks();
      alert("Book added successfully!");
    } else {
      const errorData = await res.json();
      alert("Failed to add book: " + (errorData.message || res.statusText));
    }
  } catch (err) {
    console.error("Error adding book:", err);
    alert("Error adding book");
  }
});

// Delete book function
async function deleteBook(bookId) {
  if (!confirm("Are you sure you want to delete this book?")) return;

  try {
    const res = await fetch(`${API_BASE_URL}/${bookId}`, {
      method: "DELETE",
    });

    if (res.ok) {
      fetchBooks();
      alert("Book deleted successfully!");
    } else {
      alert("Failed to delete book");
    }
  } catch (err) {
    console.error("Error deleting book:", err);
    alert("Error deleting book");
  }
}

// Search bar handler (search while typing)
searchBar.addEventListener("input", (e) => {
  const keyword = e.target.value.trim();
  fetchBooks(keyword);
});

// Initial load
fetchBooks();

// Expose deleteBook to global so buttons can call it
window.deleteBook = deleteBook;
