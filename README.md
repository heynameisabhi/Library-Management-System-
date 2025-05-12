
# 📚 Library Management System – Backend

A fully functional RESTful backend for a Library Management System built with Spring Boot. This project handles core features such as book management, member records, staff tracking, transaction history, fine calculations, and more. It exposes powerful HTTP endpoints that can be tested using Postman, Talend API Tester, or integrated into any frontend.

💡 Built with beginners in mind but powerful enough for real-world use.

---

# 🛠️ Tech Stack

| Layer       | Technology                |
|-------------|---------------------------|
| Language    | Java (JDK 17+)            |
| Framework   | Spring Boot (STS)         |
| ORM         | Spring Data JPA           |
| Database    | MySQL (local DB)          |
| API Style   | REST (JSON-based)         |
| Testing     | Talend API Tester, Postman|
| View Engine | Thymeleaf (for frontend - optional) |

---

# 📦 Project Modules

✔ Book Management  
✔ Member Management  
✔ Staff Management  
✔ Transaction History (Issue/Return)  
✔ Fine Tracking  
✔ Search functionality (by title/author)  
✔ Full CRUD (Create, Read, Update, Delete)  
✔ REST API integration (GET, POST, PUT, DELETE)

---

# 📁 Project Structure

src/
├── main/
│   ├── java/pkg1/
│   │   ├── library/  
│   │   │   ├── BookEntity.java  
│   │   │   ├── MemberEntity.java  
│   │   │   ├── StaffEntity.java  
│   │   │   ├── TransactionsEntity.java  
│   │   │   ├── FineEntity.java  
│   │   │   ├── BookRepo.java (and other Repos)  
│   │   ├── services/  
│   │   │   ├── BookService.java (and others)  
│   │   ├── controllers/  
│   │   │   ├── BookController.java  
│   │   │   ├── MemberController.java  
│   │   │   ├── TransactionsController.java  
│   │   │   └── FineController.java  
│   └── resources/  
│       ├── application.properties  
│       └── templates/ (if frontend is added)

---

# 📡 API Endpoints

| HTTP Method | Endpoint               | Description                |
|-------------|------------------------|----------------------------|
| GET         | /books                 | Get all books              |
| POST        | /books                 | Add a new book             |
| PUT         | /books/{id}            | Update a book              |
| DELETE      | /books/{id}            | Delete a book              |
| GET         | /books/search?keyword= | Search by title/author     |
| ...         | /members, /staff, etc. | Similar pattern for others |

All responses and requests are in JSON.

---

# 🧪 How to Test

Use Postman or Talend API Tester:

Example POST /books:
Request body:
{
  "title": "Atomic Habits",
  "author": "James Clear",
  "isbn": "978-0735211292"
}

→ Will return: a saved BookEntity with an auto-generated ID

---

# 🧰 Setup Instructions

1. Clone this repo:   git clone https://github.com/heynameisabhi/Library-Management-System-.git

2. Open in Spring Tool Suite (STS)

3. Update application.properties:
spring.datasource.url=jdbc:mysql://localhost:3306/library_db  
spring.datasource.username=root  
spring.datasource.password=your_password  
spring.jpa.hibernate.ddl-auto=update

4. Run the main class:
LibraryManagementApplication.java

5. Use Talend or Postman to hit:
http://localhost:8080/books

---

# 📝 Sample Entities

BookEntity:
- id: Integer
- title: String
- author: String
- isbn: String
- genre: String
- availability: boolean

MemberEntity:
- id: Integer
- name: String
- email: String
- memberType: String

...

---

# 🚀 Future Enhancements

- Role-based user authentication (Spring Security)
- Admin dashboard UI (React or Angular)
- Email notifications for due dates
- Pagination & Sorting APIs
- Export data to Excel/PDF

---

