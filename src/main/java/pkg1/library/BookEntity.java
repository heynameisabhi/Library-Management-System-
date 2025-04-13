package pkg1.library;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name="Book")
public class BookEntity {
	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	@Column(name = "BookId")
	private int bookId;
	
	@Column(name ="Title",nullable = false)
	private String title;
	
	@Column(name = "Author", nullable = false)
	private String author;
	
	@Column(name = "Genre")
	private String genre;
	
	@Column(name = "ISBN", unique = true)
	private String isbn;
	
	@Column(name = "PublicationYear")
    private int publicationYear;
	
	@Column(name = "PublicationName")
    private String publicationName;
	
    @Column(name = "Availability")
    private boolean availability;

	public BookEntity() {
		super();
	}

	public BookEntity(int bookId, String title, String author, String genre, String isbn, int publicationYear,
			String publicationName, boolean availability) {
		super();
		this.bookId = bookId;
		this.title = title;
		this.author = author;
		this.genre = genre;
		this.isbn = isbn;
		this.publicationYear = publicationYear;
		this.publicationName = publicationName;
		this.availability = availability;
	}

	public int getBookId() {
		return bookId;
	}

	public void setBookId(int bookId) {
		this.bookId = bookId;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getAuthor() {
		return author;
	}

	public void setAuthor(String author) {
		this.author = author;
	}

	public String getGenre() {
		return genre;
	}

	public void setGenre(String genre) {
		this.genre = genre;
	}

	public String getIsbn() {
		return isbn;
	}

	public void setIsbn(String isbn) {
		this.isbn = isbn;
	}

	public int getPublicationYear() {
		return publicationYear;
	}

	public void setPublicationYear(int publicationYear) {
		this.publicationYear = publicationYear;
	}

	public String getPublicationName() {
		return publicationName;
	}

	public void setPublicationName(String publicationName) {
		this.publicationName = publicationName;
	}

	public boolean isAvailability() {
		return availability;
	}

	public void setAvailability(boolean availability) {
		this.availability = availability;
	}

	
	
	
	
	

	

}
