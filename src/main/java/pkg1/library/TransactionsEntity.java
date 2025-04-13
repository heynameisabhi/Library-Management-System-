package pkg1.library;

import java.math.BigDecimal;
import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name="Transactions")
public class TransactionsEntity {
	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	@Column(name="TransactionId")
	private int TransactionId;
	
	@ManyToOne
	@JoinColumn(name="BookId",nullable=false)
	private BookEntity bookId;
	
	@ManyToOne 
	@JoinColumn(name="MemberId",nullable= false)
	private MemberEntity memberId;
	
	@Column(name="DateBorrowed")
	private LocalDate dateborrowed;
	
	@ManyToOne
	@JoinColumn(name="StaffID")
	private StaffEntity staffId;
	
	@Column(name="DueDate")
	private LocalDate duedate;
	
	@Column(name="DateReturned")
	private LocalDate datereturned;
	
	@Column(name="FineAmount")
	private BigDecimal fineamount;

	public TransactionsEntity() {
		super();
	}

	public TransactionsEntity(int transactionId, BookEntity bookId, MemberEntity memberId, LocalDate dateborrowed,
			StaffEntity staffId, LocalDate duedate, LocalDate datereturned, BigDecimal fineamount) {
		super();
		TransactionId = transactionId;
		this.bookId = bookId;
		this.memberId = memberId;
		this.dateborrowed = dateborrowed;
		this.staffId = staffId;
		this.duedate = duedate;
		this.datereturned = datereturned;
		this.fineamount = fineamount;
	}

	public int getTransactionId() {
		return TransactionId;
	}

	public void setTransactionId(int transactionId) {
		TransactionId = transactionId;
	}

	public BookEntity getBookId() {
		return bookId;
	}

	public void setBookId(BookEntity bookId) {
		this.bookId = bookId;
	}

	public MemberEntity getMemberId() {
		return memberId;
	}

	public void setMemberId(MemberEntity memberId) {
		this.memberId = memberId;
	}

	public LocalDate getDateborrowed() {
		return dateborrowed;
	}

	public void setDateborrowed(LocalDate dateborrowed) {
		this.dateborrowed = dateborrowed;
	}

	public StaffEntity getStaffId() {
		return staffId;
	}

	public void setStaffId(StaffEntity staffId) {
		this.staffId = staffId;
	}

	public LocalDate getDuedate() {
		return duedate;
	}

	public void setDuedate(LocalDate duedate) {
		this.duedate = duedate;
	}

	public LocalDate getDatereturned() {
		return datereturned;
	}

	public void setDatereturned(LocalDate datereturned) {
		this.datereturned = datereturned;
	}

	public BigDecimal getFineamount() {
		return fineamount;
	}

	public void setFineamount(BigDecimal fineamount) {
		this.fineamount = fineamount;
	}
	
	
	

}
