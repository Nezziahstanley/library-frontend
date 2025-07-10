class UI {
  static async displayBooks() {
    try {
      const response = await fetch('https://your-backend-url/api/books');
      const books = await response.json();
      const bookList = document.getElementById('bookList');
      bookList.innerHTML = '';
      books.forEach(book => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${book.title}</td>
          <td>${book.author}</td>
          <td>${book.isbn}</td>
          <td>
            <button class="delete-btn" onclick="UI.deleteBook('${book.isbn}')">Delete</button>
            <button class="borrow-btn" onclick="UI.borrowBook('${book.isbn}')">${book.status === 'available' ? 'Borrow' : 'Borrowed'}</button>
          </td>
        `;
        bookList.appendChild(row);
      });
    } catch (err) {
      alert('Error fetching books');
    }
  }
  static async addBook(book) {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://your-backend-url/api/books', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(book),
      });
      if (response.ok) {
        this.displayBooks();
        this.clearForm();
        alert('Book added successfully');
      } else {
        alert('Failed to add book');
      }
    } catch (err) {
      alert('Error adding book');
    }
  }
  static async deleteBook(isbn) {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://your-backend-url/api/books/${isbn}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        this.displayBooks();
        alert('Book deleted');
      } else {
        alert('Failed to delete book');
      }
    } catch (err) {
      alert('Error deleting book');
    }
  }
  static async borrowBook(isbn) {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://your-backend-url/api/books/borrow/${isbn}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        this.displayBooks();
        alert('Book borrowed');
      } else {
        alert('Failed to borrow book');
      }
    } catch (err) {
      alert('Error borrowing book');
    }
  }
  static clearForm() {
    document.getElementById('bookForm').reset();
  }
  static searchBooks(searchTerm) {
    const rows = document.querySelectorAll('#bookList tr');
    rows.forEach(row => {
      const title = row.cells[0].textContent.toLowerCase();
      row.style.display = title.includes(searchTerm.toLowerCase()) ? '' : 'none';
    });
  }
}

// Event Listeners
document.getElementById('loginForm')?.addEventListener('submit', async e => {
  e.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  try {
    const response = await fetch('https://your-backend-url/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const data = await response.json();
    if (response.ok) {
      localStorage.setItem('token', data.token);
      document.getElementById('loginSection').style.display = 'none';
      document.getElementById('mainSection').style.display = 'block';
      UI.displayBooks();
    } else {
      alert(data.message);
    }
  } catch (err) {
    alert('Error logging in');
  }
});

document.getElementById('bookForm')?.addEventListener('submit', e => {
  e.preventDefault();
  const title = document.getElementById('title').value;
  const author = document.getElementById('author').value;
  const isbn = document.getElementById('isbn').value;
  const genre = document.getElementById('genre').value;
  const book = { title, author, isbn, genre };
  UI.addBook(book);
});

document.getElementById('search')?.addEventListener('input', e => {
  UI.searchBooks(e.target.value);
});

// Check if logged in
if (localStorage.getItem('token')) {
  document.getElementById('loginSection').style.display = 'none';
  document.getElementById('mainSection').style.display = 'block';
  UI.displayBooks();
}