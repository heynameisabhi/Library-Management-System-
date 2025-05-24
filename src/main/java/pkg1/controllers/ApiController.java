package pkg1.controllers;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
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
import pkg1.library.MemberEntity;
import pkg1.library.StaffEntity;
import pkg1.library.TransactionsEntity;
import pkg1.services.BookService;
import pkg1.services.MemberService;
import pkg1.services.StaffService;
import pkg1.services.TransactionsService;

/**
 * This controller provides API endpoints with the /api prefix
 * It delegates to the appropriate service classes
 */
@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class ApiController {

    @Autowired
    private BookService bookService;

    @Autowired
    private MemberService memberService;

    @Autowired
    private StaffService staffService;

    @Autowired
    private TransactionsService transactionsService;

    // Book endpoints
    @GetMapping("/books")
    public List<BookEntity> getAllBooks() {
        return bookService.getAllBooks();
    }

    @GetMapping("/books/{id}")
    public Optional<BookEntity> getBookById(@PathVariable Long id) {
        return bookService.getBookById(id);
    }

    // Member endpoints
    @GetMapping("/members")
    public List<MemberEntity> getAllMembers() {
        return memberService.getAllMembers();
    }

    @GetMapping("/members/{id}")
    public Optional<MemberEntity> getMemberById(@PathVariable Long id) {
        return memberService.getMemberById(id);
    }

    // Staff endpoints
    @GetMapping("/staff")
    public List<StaffEntity> getAllStaff() {
        return staffService.getAllStaff();
    }

    @GetMapping("/staff/{id}")
    public Optional<StaffEntity> getStaffById(@PathVariable Long id) {
        return staffService.getStaffById(id);
    }

    // Transaction endpoints
    @GetMapping("/transactions")
    public List<TransactionsEntity> getAllTransactions() {
        return transactionsService.getAllTransactions();
    }

    @GetMapping("/transactions/{id}")
    public Optional<TransactionsEntity> getTransactionById(@PathVariable Long id) {
        return transactionsService.getTransactionById(id);
    }

    // Add POST endpoint that accepts JSON data for issuing books
    @PostMapping("/transactions")
    public ResponseEntity<TransactionsEntity> issueBookJson(@RequestBody Map<String, Object> requestData) {
        try {
            // Handle multiple possible field names for flexibility
            Object bookIdObj = requestData.get("book_id") != null ? requestData.get("book_id") : requestData.get("bookId");
            Object memberIdObj = requestData.get("member_id") != null ? requestData.get("member_id") : requestData.get("memberid");
            Object staffIdObj = requestData.get("staffid") != null ? requestData.get("staffid") : requestData.get("staff_id");

            if (bookIdObj == null || memberIdObj == null) {
                throw new RuntimeException("Missing required fields: book_id and member_id are required");
            }

            Long bookId = Long.valueOf(bookIdObj.toString());
            Long memberId = Long.valueOf(memberIdObj.toString());
            Long staffId = staffIdObj != null ? Long.valueOf(staffIdObj.toString()) : null;

            TransactionsEntity transaction = transactionsService.issueBook(bookId, memberId, staffId);
            return ResponseEntity.status(201).body(transaction);
        } catch (NumberFormatException e) {
            throw new RuntimeException("Failed to issue book: Invalid number format - " + e.getMessage());
        } catch (Exception e) {
            throw new RuntimeException("Failed to issue book: " + e.getMessage());
        }
    }

    @PostMapping("/transactions/issue")
    public TransactionsEntity issueBook(
            @RequestParam Long bookId,
            @RequestParam Long memberId,
            @RequestParam(required = false) Long staffId
    ) {
        return transactionsService.issueBook(bookId, memberId, staffId);
    }

    @PutMapping("/transactions/{id}")
    public TransactionsEntity updateTransaction(
            @PathVariable Long id,
            @RequestBody TransactionsEntity update
    ) {
        return transactionsService.updateTransaction(id, update);
    }

    // Return book endpoint
    @PutMapping("/transactions/{id}/return")
    public ResponseEntity<TransactionsEntity> returnBook(@PathVariable Long id) {
        try {
            // Create an update object with today's date as return date
            TransactionsEntity update = new TransactionsEntity();
            update.setDatereturned(java.time.LocalDate.now());

            TransactionsEntity returned = transactionsService.updateTransaction(id, update);
            return ResponseEntity.ok(returned);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/transactions/{id}")
    public void deleteTransaction(@PathVariable Long id) {
        transactionsService.deleteTransaction(id);
    }
}
