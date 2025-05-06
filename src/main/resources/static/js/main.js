document.getElementById("addBookForm").addEventListener("submit", function(e) {
     e.preventDefault();
     
     // Show loading state
     const submitBtn = this.querySelector('button[type="submit"]');
     const originalText = submitBtn.innerHTML;
     submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Adding...';
     submitBtn.disabled = true;

     const book = {
       title: document.getElementById("title").value,
       author: document.getElementById("author").value,
       isbn: document.getElementById("isbn").value
     };

     fetch("/books", {
       method: "POST",
       headers: { "Content-Type": "application/json" },
       body: JSON.stringify(book)
     })
     .then(response => {
       if (!response.ok) {
         throw new Error('Network response was not ok');
       }
       return response.json();
     })
     .then(() => {
       // Show success message
       const successMessage = document.createElement('div');
       successMessage.className = 'alert alert-success';
       successMessage.innerHTML = `
         <i class="fas fa-check-circle"></i>
         Book added successfully!
       `;
       document.querySelector('.form-container').prepend(successMessage);

       // Reset form
       document.getElementById("addBookForm").reset();

       // Redirect after delay
       setTimeout(() => {
         window.location.href = "books.html";
       }, 1500);
     })
     .catch(error => {
       // Show error message
       const errorMessage = document.createElement('div');
       errorMessage.className = 'alert alert-danger';
       errorMessage.innerHTML = `
         <i class="fas fa-exclamation-circle"></i>
         Error adding book. Please try again.
       `;
       document.querySelector('.form-container').prepend(errorMessage);

       // Reset button state
       submitBtn.innerHTML = originalText;
       submitBtn.disabled = false;
     });
   });
   
   // Add loading animation
      document.getElementById('booksTableBody').innerHTML = `
        <tr>
          <td colspan="5" class="text-center">
            <div class="loading-spinner">
              <i class="fas fa-spinner fa-spin"></i> Loading books...
            </div>
          </td>
        </tr>
      `;

      fetch("/books")
        .then(res => res.json())
        .then(data => {
          const tbody = document.getElementById("booksTableBody");
          if (data.length === 0) {
            tbody.innerHTML = `
              <tr>
                <td colspan="5" class="text-center">
                  <div class="empty-state">
                    <i class="fas fa-book-open"></i>
                    <p>No books found. Add your first book!</p>
                    <a href="add-book.html" class="btn btn-success">Add Book</a>
                  </div>
                </td>
              </tr>
            `;
            return;
          }
          
          tbody.innerHTML = data.map(book => `
            <tr>
              <td>${book.id}</td>
              <td>${book.title}</td>
              <td>${book.author}</td>
              <td>${book.isbn}</td>
              <td>
                <div class="action-buttons">
                  <a href="update-book.html?id=${book.id}" class="btn btn-sm btn-warning">
                    <i class="fas fa-edit"></i> Edit
                  </a>
                  <button onclick="deleteBook(${book.id})" class="btn btn-sm btn-danger">
                    <i class="fas fa-trash"></i> Delete
                  </button>
                </div>
              </td>
            </tr>
          `).join('');
        })
        .catch(error => {
          document.getElementById('booksTableBody').innerHTML = `
            <tr>
              <td colspan="5" class="text-center error-message">
                <i class="fas fa-exclamation-circle"></i>
                <p>Error loading books. Please try again later.</p>
              </td>
            </tr>
          `;
        });

      function deleteBook(id) {
        if (confirm('Are you sure you want to delete this book?')) {
          fetch(`/books/${id}`, {
            method: 'DELETE'
          })
          .then(() => {
            // Remove the row with animation
            const row = document.querySelector(`tr[data-id="${id}"]`);
            row.style.opacity = '0';
            setTimeout(() => {
              row.remove();
              // Check if table is empty
              if (document.querySelectorAll('tbody tr').length === 0) {
                document.getElementById('booksTableBody').innerHTML = `
                  <tr>
                    <td colspan="5" class="text-center">
                      <div class="empty-state">
                        <i class="fas fa-book-open"></i>
                        <p>No books found. Add your first book!</p>
                        <a href="add-book.html" class="btn btn-success">Add Book</a>
                      </div>
                    </td>
                  </tr>
                `;
              }
            }, 300);
          })
          .catch(error => {
            alert('Error deleting book. Please try again.');
          });
        }
      }
	  
	  let searchTimeout;

	      document.getElementById('searchInput').addEventListener('input', function(e) {
	        clearTimeout(searchTimeout);
	        searchTimeout = setTimeout(() => {
	          if (e.target.value.length >= 2) {
	            searchBooks();
	          } else {
	            document.getElementById('searchResults').innerHTML = `
	              <div class="initial-state">
	                <i class="fas fa-search"></i>
	                <p>Enter at least 2 characters to search</p>
	              </div>
	            `;
	          }
	        }, 300);
	      });

	      function searchBooks() {
	        const searchTerm = document.getElementById('searchInput').value;
	        const searchTitle = document.getElementById('searchTitle').checked;
	        const searchAuthor = document.getElementById('searchAuthor').checked;
	        const searchISBN = document.getElementById('searchISBN').checked;

	        if (searchTerm.length < 2) return;

	        // Show loading state
	        document.getElementById('searchResults').innerHTML = `
	          <div class="loading-state">
	            <i class="fas fa-spinner fa-spin"></i>
	            <p>Searching...</p>
	          </div>
	        `;

	        fetch(`/books/search?q=${encodeURIComponent(searchTerm)}&title=${searchTitle}&author=${searchAuthor}&isbn=${searchISBN}`)
	          .then(res => res.json())
	          .then(data => {
	            const resultsDiv = document.getElementById('searchResults');
	            
	            if (data.length === 0) {
	              resultsDiv.innerHTML = `
	                <div class="no-results">
	                  <i class="fas fa-book-open"></i>
	                  <p>No books found matching your search</p>
	                  <p class="search-tip">Try different keywords or check your spelling</p>
	                </div>
	              `;
	              return;
	            }

	            resultsDiv.innerHTML = `
	              <div class="results-header">
	                <h3>Found ${data.length} results</h3>
	              </div>
	              <div class="results-grid">
	                ${data.map(book => `
	                  <div class="book-card">
	                    <div class="book-info">
	                      <h4>${book.title}</h4>
	                      <p class="author"><i class="fas fa-user"></i> ${book.author}</p>
	                      <p class="isbn"><i class="fas fa-barcode"></i> ${book.isbn}</p>
	                    </div>
	                    <div class="book-actions">
	                      <a href="update-book.html?id=${book.id}" class="btn btn-sm btn-warning">
	                        <i class="fas fa-edit"></i> Edit
	                      </a>
	                      <button onclick="deleteBook(${book.id})" class="btn btn-sm btn-danger">
	                        <i class="fas fa-trash"></i> Delete
	                      </button>
	                    </div>
	                  </div>
	                `).join('')}
	              </div>
	            `;
	          })
	          .catch(error => {
	            document.getElementById('searchResults').innerHTML = `
	              <div class="error-state">
	                <i class="fas fa-exclamation-circle"></i>
	                <p>Error searching books. Please try again.</p>
	              </div>
	            `;
	          });
	      }

	      function deleteBook(id) {
	        if (confirm('Are you sure you want to delete this book?')) {
	          fetch(`/books/${id}`, {
	            method: 'DELETE'
	          })
	          .then(() => {
	            // Remove the book card with animation
	            const card = document.querySelector(`.book-card[data-id="${id}"]`);
	            card.style.opacity = '0';
	            setTimeout(() => {
	              card.remove();
	              // Check if no results left
	              if (document.querySelectorAll('.book-card').length === 0) {
	                document.getElementById('searchResults').innerHTML = `
	                  <div class="no-results">
	                    <i class="fas fa-book-open"></i>
	                    <p>No books found matching your search</p>
	                    <p class="search-tip">Try different keywords or check your spelling</p>
	                  </div>
	                `;
	              }
	            }, 300);
	          })
	          .catch(error => {
	            alert('Error deleting book. Please try again.');
	          });
	        }
	      }
		  
		  const id = new URLSearchParams(window.location.search).get("id");
		      fetch(`/books/${id}`)
		        .then(res => res.json())
		        .then(book => {
		          document.getElementById("title").value = book.title;
		          document.getElementById("author").value = book.author;
		          document.getElementById("isbn").value = book.isbn;
		        });

		      document.getElementById("updateBookForm").addEventListener("submit", function(e) {
		        e.preventDefault();
		        const updatedBook = {
		          title: document.getElementById("title").value,
		          author: document.getElementById("author").value,
		          isbn: document.getElementById("isbn").value
		        };
		        fetch(`/books/${id}`, {
		          method: "PUT",
		          headers: { "Content-Type": "application/json" },
		          body: JSON.stringify(updatedBook)
		        }).then(() => {
		          alert("Book updated!");
		          window.location.href = "books.html";
		        });
		      });