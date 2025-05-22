
package pkg1.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import pkg1.library.BookEntity;
import pkg1.library.BookRepo;
@Service
public class BookService {
	@Autowired
	private BookRepo bookRepo;
	
	public List<BookEntity> searchBooks(String keyword){
		return bookRepo.searchBooks(keyword);
	}
	
	public List<BookEntity> getAllBooks(){
		return bookRepo.findAll();
	}
	
	public Optional<BookEntity> getBookById(Long id) {
		return bookRepo.findById(id);
	}
	
	public BookEntity addBook(BookEntity book) {
		return bookRepo.save(book);
	}
	
	public BookEntity updateBookEntity(Long id, BookEntity book) {
		book.setBookId(id);
		return bookRepo.save(book);
		
	}
	
	public void deleteBook(Long id) {
		bookRepo.deleteById(id);
		
	}
	}
	
	
	
	
