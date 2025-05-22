package pkg1.services;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import pkg1.library.BookEntity;
import pkg1.library.BookRepo;
import pkg1.library.MemberEntity;
import pkg1.library.MemberRepo;
import pkg1.library.StaffEntity;
import pkg1.library.StaffRepo;
import pkg1.library.TransactionsEntity;
import pkg1.library.TransactionsRepo;

@Service
public class TransactionsService {

    @Autowired
    private TransactionsRepo transactionsRepo;

    @Autowired
    private BookRepo bookRepo;

    @Autowired
    private MemberRepo memberRepo;

    @Autowired
    private StaffRepo staffRepo;

    /**
     * Issue a book: creates a new transaction record.
     */
    public TransactionsEntity issueBook(Long bookId, Long memberId, Long staffId) {
        BookEntity   book   = bookRepo.findById(bookId)
                             .orElseThrow(() -> new RuntimeException("Book not found: " + bookId));

        // Check if the book is already issued (not available)
        if (!book.isAvailability()) {
            throw new RuntimeException("Book is already issued and not available: " + bookId);
        }

        MemberEntity member = memberRepo.findById(memberId)
                             .orElseThrow(() -> new RuntimeException("Member not found: " + memberId));
        StaffEntity  staff  = (staffId == null)
                             ? null
                             : staffRepo.findById(staffId)
                               .orElseThrow(() -> new RuntimeException("Staff not found: " + staffId));

        // Update book availability status to false (not available)
        book.setAvailability(false);
        bookRepo.save(book);

        TransactionsEntity tx = new TransactionsEntity();
        tx.setBookId(book);
        tx.setMemberId(member);
        tx.setStaffId(staff);
        tx.setDateborrowed(LocalDate.now());
        tx.setDuedate(LocalDate.now().plusDays(14));      // 2-week due
        tx.setDatereturned(null);
        tx.setFineamount(0);

        return transactionsRepo.save(tx);
    }

    /**
     * Get all transactions (issued books).
     */
    public List<TransactionsEntity> getAllTransactions() {
        return transactionsRepo.findAll();
    }

    /**
     * Get a single transaction by ID.
     */
    public Optional<TransactionsEntity> getTransactionById(Long id) {
        return transactionsRepo.findById(id);
    }

    /**
     * Update an existing transaction (e.g., to set return date or fine).
     */
    public TransactionsEntity updateTransaction(Long id, TransactionsEntity update) {
        TransactionsEntity existing = transactionsRepo.findById(id)
            .orElseThrow(() -> new RuntimeException("Transaction not found: " + id));

        // Check if the book is being returned (dateReturned is being set)
        if (update.getDatereturned() != null && existing.getDatereturned() == null) {
            // Book is being returned, update its availability status to true (available)
            BookEntity book = existing.getBookId();
            book.setAvailability(true);
            bookRepo.save(book);
        }

        // only update fields you want to allow
        existing.setDatereturned(update.getDatereturned());
        existing.setFineamount(update.getFineamount());
        // you could also allow updating dueDate, staff, etc.

        return transactionsRepo.save(existing);
    }

    /**
     * Delete a transaction record.
     */
    public void deleteTransaction(Long id) {
        TransactionsEntity transaction = transactionsRepo.findById(id)
            .orElseThrow(() -> new RuntimeException("Transaction not found: " + id));

        // If the book hasn't been returned yet (dateReturned is null), update its availability
        if (transaction.getDatereturned() == null) {
            BookEntity book = transaction.getBookId();
            book.setAvailability(true);
            bookRepo.save(book);
        }

        transactionsRepo.deleteById(id);
    }
}
