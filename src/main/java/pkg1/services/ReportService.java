package pkg1.services;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import pkg1.library.BookEntity;
import pkg1.library.BookRepo;
import pkg1.library.FineEntity;
import pkg1.library.FineRepo;
import pkg1.library.MemberEntity;
import pkg1.library.MemberRepo;
import pkg1.library.StaffRepo;
import pkg1.library.TransactionsEntity;
import pkg1.library.TransactionsRepo;

@Service
public class ReportService {

    @Autowired
    private BookRepo bookRepo;

    @Autowired
    private MemberRepo memberRepo;

    @Autowired
    private TransactionsRepo transactionsRepo;

    @Autowired
    private StaffRepo staffRepo;

    @Autowired
    private FineRepo fineRepo;

    /**
     * Generate Library Statistics Report
     */
    public Map<String, Object> getLibraryStatistics() {
        Map<String, Object> stats = new HashMap<>();

        // Basic counts
        long totalBooks = bookRepo.count();
        long totalMembers = memberRepo.count();
        long totalStaff = staffRepo.count();
        long totalTransactions = transactionsRepo.count();

        // Book statistics
        long availableBooks = bookRepo.findAll().stream()
            .mapToLong(book -> book.isAvailability() ? 1 : 0)
            .sum();
        long issuedBooks = totalBooks - availableBooks;

        // Transaction statistics
        List<TransactionsEntity> allTransactions = transactionsRepo.findAll();
        long activeTransactions = allTransactions.stream()
            .mapToLong(tx -> tx.getDatereturned() == null ? 1 : 0)
            .sum();
        long completedTransactions = allTransactions.size() - activeTransactions;

        // Overdue books
        LocalDate today = LocalDate.now();
        long overdueBooks = allTransactions.stream()
            .mapToLong(tx -> tx.getDatereturned() == null &&
                           tx.getDuedate() != null &&
                           tx.getDuedate().isBefore(today) ? 1 : 0)
            .sum();

        // Fine statistics
        List<FineEntity> allFines = fineRepo.findAll();
        double totalFines = allFines.stream()
            .mapToDouble(FineEntity::getFineAmount)
            .sum();
        double paidFines = allFines.stream()
            .filter(fine -> fine.isPaymentStatus())
            .mapToDouble(FineEntity::getFineAmount)
            .sum();
        double outstandingFines = totalFines - paidFines;

        stats.put("totalBooks", totalBooks);
        stats.put("totalMembers", totalMembers);
        stats.put("totalStaff", totalStaff);
        stats.put("totalTransactions", totalTransactions);
        stats.put("availableBooks", availableBooks);
        stats.put("issuedBooks", issuedBooks);
        stats.put("activeTransactions", activeTransactions);
        stats.put("completedTransactions", completedTransactions);
        stats.put("overdueBooks", overdueBooks);
        stats.put("totalFines", totalFines);
        stats.put("paidFines", paidFines);
        stats.put("outstandingFines", outstandingFines);
        stats.put("generatedAt", LocalDate.now());

        return stats;
    }

    /**
     * Generate Book Report
     */
    public Map<String, Object> getBookReport() {
        Map<String, Object> report = new HashMap<>();
        List<BookEntity> allBooks = bookRepo.findAll();

        // Books by category
        Map<String, Long> booksByCategory = allBooks.stream()
            .collect(Collectors.groupingBy(
                book -> book.getGenre() != null ? book.getGenre() : "Unknown",
                Collectors.counting()
            ));

        // Books by availability
        Map<String, Long> booksByAvailability = allBooks.stream()
            .collect(Collectors.groupingBy(
                book -> book.isAvailability() ? "Available" : "Issued",
                Collectors.counting()
            ));

        // Most popular books (by transaction count)
        List<TransactionsEntity> allTransactions = transactionsRepo.findAll();
        Map<String, Long> bookPopularity = allTransactions.stream()
            .collect(Collectors.groupingBy(
                tx -> tx.getBookId().getTitle(),
                Collectors.counting()
            ));

        List<Map<String, Object>> popularBooks = bookPopularity.entrySet().stream()
            .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
            .limit(10)
            .map(entry -> {
                Map<String, Object> bookInfo = new HashMap<>();
                bookInfo.put("title", entry.getKey());
                bookInfo.put("issueCount", entry.getValue());
                return bookInfo;
            })
            .collect(Collectors.toList());

        report.put("totalBooks", allBooks.size());
        report.put("booksByCategory", booksByCategory);
        report.put("booksByAvailability", booksByAvailability);
        report.put("popularBooks", popularBooks);
        report.put("generatedAt", LocalDate.now());

        return report;
    }

    /**
     * Generate Member Report
     */
    public Map<String, Object> getMemberReport() {
        Map<String, Object> report = new HashMap<>();
        List<MemberEntity> allMembers = memberRepo.findAll();
        List<TransactionsEntity> allTransactions = transactionsRepo.findAll();

        // Members by membership type
        Map<String, Long> membersByType = allMembers.stream()
            .collect(Collectors.groupingBy(
                member -> member.getMembershipType() != null ? member.getMembershipType().toString() : "Unknown",
                Collectors.counting()
            ));

        // Active members (members with current transactions)
        Set<Long> activeMemberIds = allTransactions.stream()
            .filter(tx -> tx.getDatereturned() == null)
            .map(tx -> tx.getMemberId().getMemberid())
            .collect(Collectors.toSet());

        // Most active members (by transaction count)
        Map<String, Long> memberActivity = allTransactions.stream()
            .collect(Collectors.groupingBy(
                tx -> tx.getMemberId().getName(),
                Collectors.counting()
            ));

        List<Map<String, Object>> activeMembersList = memberActivity.entrySet().stream()
            .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
            .limit(10)
            .map(entry -> {
                Map<String, Object> memberInfo = new HashMap<>();
                memberInfo.put("name", entry.getKey());
                memberInfo.put("transactionCount", entry.getValue());
                return memberInfo;
            })
            .collect(Collectors.toList());

        report.put("totalMembers", allMembers.size());
        report.put("membersByType", membersByType);
        report.put("activeMembersCount", activeMemberIds.size());
        report.put("mostActiveMembers", activeMembersList);
        report.put("generatedAt", LocalDate.now());

        return report;
    }

    /**
     * Generate Transaction Report
     */
    public Map<String, Object> getTransactionReport() {
        Map<String, Object> report = new HashMap<>();
        List<TransactionsEntity> allTransactions = transactionsRepo.findAll();
        LocalDate today = LocalDate.now();

        // Transactions by status
        long activeTransactions = allTransactions.stream()
            .mapToLong(tx -> tx.getDatereturned() == null ? 1 : 0)
            .sum();
        long completedTransactions = allTransactions.size() - activeTransactions;

        // Overdue transactions
        List<Map<String, Object>> overdueTransactions = allTransactions.stream()
            .filter(tx -> tx.getDatereturned() == null &&
                         tx.getDuedate() != null &&
                         tx.getDuedate().isBefore(today))
            .map(tx -> {
                Map<String, Object> overdueInfo = new HashMap<>();
                overdueInfo.put("transactionId", tx.getTransactionId());
                overdueInfo.put("bookTitle", tx.getBookId().getTitle());
                overdueInfo.put("memberName", tx.getMemberId().getName());
                overdueInfo.put("dueDate", tx.getDuedate());
                overdueInfo.put("daysOverdue", today.toEpochDay() - tx.getDuedate().toEpochDay());
                return overdueInfo;
            })
            .collect(Collectors.toList());

        // Recent transactions (last 30 days)
        LocalDate thirtyDaysAgo = today.minusDays(30);
        long recentTransactions = allTransactions.stream()
            .mapToLong(tx -> tx.getDateborrowed() != null &&
                           tx.getDateborrowed().isAfter(thirtyDaysAgo) ? 1 : 0)
            .sum();

        report.put("totalTransactions", allTransactions.size());
        report.put("activeTransactions", activeTransactions);
        report.put("completedTransactions", completedTransactions);
        report.put("overdueTransactions", overdueTransactions);
        report.put("overdueCount", overdueTransactions.size());
        report.put("recentTransactions", recentTransactions);
        report.put("generatedAt", LocalDate.now());

        return report;
    }

    /**
     * Generate Fine Report
     */
    public Map<String, Object> getFineReport() {
        Map<String, Object> report = new HashMap<>();
        List<FineEntity> allFines = fineRepo.findAll();

        // Fine statistics
        double totalFines = allFines.stream()
            .mapToDouble(FineEntity::getFineAmount)
            .sum();

        double paidFines = allFines.stream()
            .filter(fine -> fine.isPaymentStatus())
            .mapToDouble(FineEntity::getFineAmount)
            .sum();

        double outstandingFines = totalFines - paidFines;

        // Outstanding fines details
        List<Map<String, Object>> outstandingFinesList = allFines.stream()
            .filter(fine -> !fine.isPaymentStatus())
            .map(fine -> {
                Map<String, Object> fineInfo = new HashMap<>();
                fineInfo.put("fineId", fine.getFineid());
                fineInfo.put("memberName", fine.getMemberid() != null ? fine.getMemberid().getName() : "Unknown");
                fineInfo.put("amount", fine.getFineAmount());
                fineInfo.put("reason", "Late return"); // Default reason since field doesn't exist
                fineInfo.put("dateIssued", "Unknown"); // Default since field doesn't exist
                return fineInfo;
            })
            .collect(Collectors.toList());

        report.put("totalFines", totalFines);
        report.put("paidFines", paidFines);
        report.put("outstandingFines", outstandingFines);
        report.put("totalFineCount", allFines.size());
        report.put("outstandingFinesList", outstandingFinesList);
        report.put("generatedAt", LocalDate.now());

        return report;
    }
}
