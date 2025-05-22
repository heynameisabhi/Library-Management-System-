package pkg1.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import pkg1.library.BookEntity;
import pkg1.library.MemberEntity;
import pkg1.library.StaffEntity;
import pkg1.library.TransactionsEntity;
import pkg1.services.BookService;
import pkg1.services.MemberService;
import pkg1.services.StaffService;
import pkg1.services.TransactionsService;

import java.util.List;
import java.util.Optional;

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
    
    @DeleteMapping("/transactions/{id}")
    public void deleteTransaction(@PathVariable Long id) {
        transactionsService.deleteTransaction(id);
    }
}
