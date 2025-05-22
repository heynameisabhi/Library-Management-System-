package pkg1.controllers;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import pkg1.library.BookEntity;
import pkg1.services.BookService;

@RestController
@RequestMapping("/books")
public class BookController {
	
	@Autowired
	private BookService bookService;
	
	@GetMapping("/search")
	public List<BookEntity> searchBooks(@RequestParam String keyword){
		return bookService.searchBooks(keyword);
	}
	
	@GetMapping
	public List<BookEntity>getAllBooks(){
		return bookService.getAllBooks();
	}
	
	@GetMapping("/{id}")
	public Optional<BookEntity> getBookById(@PathVariable Long id){
		return bookService.getBookById(id);
	}
	
	@PostMapping
	public BookEntity addBook(@RequestBody BookEntity book) {
	    return bookService.addBook(book);
	}

	
	@PutMapping("/{id}")
	public BookEntity updateBook(@PathVariable Long id, @RequestBody BookEntity book) {
		return bookService.updateBookEntity(id, book);
	}
	
	@DeleteMapping("/{id}")
	public void deleteBook(@PathVariable Long id) {
	    bookService.deleteBook(id);
	}
	

}
