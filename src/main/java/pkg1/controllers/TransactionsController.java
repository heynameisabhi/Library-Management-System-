package pkg1.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import pkg1.library.TransactionsEntity;
import pkg1.services.TransactionsService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/transactions")
public class TransactionsController {

    @Autowired
    private TransactionsService transactionsService;

    /**  
     * Issue a book: creates a new transaction record using bookId, memberId, staffId  
     * Example: POST /transactions/issue?bookId=1&memberId=2&staffId=3  
     */
    @PostMapping("/issue")
    public ResponseEntity<TransactionsEntity> issueBook(
            @RequestParam Long bookId,
            @RequestParam Long memberId,
            @RequestParam(required = false) Long staffId
    ) {
        TransactionsEntity tx = transactionsService.issueBook(bookId, memberId, staffId);
        return ResponseEntity.status(201).body(tx);
    }

    /**
     * Get all transactions (issued books)
     * GET /transactions
     */
    @GetMapping
    public List<TransactionsEntity> getAllTransactions() {
        return transactionsService.getAllTransactions();
    }

    /**
     * Get a single transaction by ID
     * GET /transactions/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<TransactionsEntity> getTransactionById(@PathVariable Long id) {
        Optional<TransactionsEntity> txOpt = transactionsService.getTransactionById(id);
        return txOpt
            .map(ResponseEntity::ok)
            .orElseGet(() -> ResponseEntity.notFound().build());
    }

    /**
     * Update an existing transaction
     * PUT /transactions/{id}
     * Body: JSON with the fields you want to update (e.g. dateReturned, fineAmount)
     */
    @PutMapping("/{id}")
    public ResponseEntity<TransactionsEntity> updateTransaction(
            @PathVariable Long id,
            @RequestBody TransactionsEntity update
    ) {
        try {
            TransactionsEntity updated = transactionsService.updateTransaction(id, update);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException ex) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Delete a transaction
     * DELETE /transactions/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTransaction(@PathVariable Long id) {
        try {
            transactionsService.deleteTransaction(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException ex) {
            return ResponseEntity.notFound().build();
        }
    }
}
