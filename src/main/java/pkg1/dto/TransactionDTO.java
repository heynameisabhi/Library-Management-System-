package pkg1.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public class TransactionDTO {
    private int transactionId; // ⬅️ lowercase 't'
    private int bookId;
    private int memberId;
    private int staffId;
    private LocalDate dateborrowed;
    private LocalDate duedate;
    private LocalDate datereturned;
    private BigDecimal fineamount;

    public TransactionDTO() {}

    public TransactionDTO(int transactionId, int bookId, int memberId, int staffId, LocalDate dateborrowed,
                          LocalDate duedate, LocalDate datereturned, BigDecimal fineamount) {
        this.transactionId = transactionId;
        this.bookId = bookId;
        this.memberId = memberId;
        this.staffId = staffId;
        this.dateborrowed = dateborrowed;
        this.duedate = duedate;
        this.datereturned = datereturned;
        this.fineamount = fineamount;
    }

    // Getters and setters
    public int getTransactionId() {
        return transactionId;
    }

    public void setTransactionId(int transactionId) {
        this.transactionId = transactionId;
    }

    public int getBookId() {
        return bookId;
    }

    public void setBookId(int bookId) {
        this.bookId = bookId;
    }

    public int getMemberId() {
        return memberId;
    }

    public void setMemberId(int memberId) {
        this.memberId = memberId;
    }

    public int getStaffId() {
        return staffId;
    }

    public void setStaffId(int staffId) {
        this.staffId = staffId;
    }

    public LocalDate getDateborrowed() {
        return dateborrowed;
    }

    public void setDateborrowed(LocalDate dateborrowed) {
        this.dateborrowed = dateborrowed;
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
