package pkg1.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pkg1.services.ReportService;

import java.util.Map;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = "*")
public class ReportController {

    @Autowired
    private ReportService reportService;

    /**
     * Get Library Statistics Report
     * GET /api/reports/statistics
     */
    @GetMapping("/statistics")
    public ResponseEntity<Map<String, Object>> getLibraryStatistics() {
        try {
            Map<String, Object> statistics = reportService.getLibraryStatistics();
            return ResponseEntity.ok(statistics);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Get Book Report
     * GET /api/reports/books
     */
    @GetMapping("/books")
    public ResponseEntity<Map<String, Object>> getBookReport() {
        try {
            Map<String, Object> bookReport = reportService.getBookReport();
            return ResponseEntity.ok(bookReport);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Get Member Report
     * GET /api/reports/members
     */
    @GetMapping("/members")
    public ResponseEntity<Map<String, Object>> getMemberReport() {
        try {
            Map<String, Object> memberReport = reportService.getMemberReport();
            return ResponseEntity.ok(memberReport);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Get Transaction Report
     * GET /api/reports/transactions
     */
    @GetMapping("/transactions")
    public ResponseEntity<Map<String, Object>> getTransactionReport() {
        try {
            Map<String, Object> transactionReport = reportService.getTransactionReport();
            return ResponseEntity.ok(transactionReport);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Get Fine Report
     * GET /api/reports/fines
     */
    @GetMapping("/fines")
    public ResponseEntity<Map<String, Object>> getFineReport() {
        try {
            Map<String, Object> fineReport = reportService.getFineReport();
            return ResponseEntity.ok(fineReport);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Get All Reports (Dashboard Summary)
     * GET /api/reports/dashboard
     */
    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboardReports() {
        try {
            Map<String, Object> dashboard = Map.of(
                "statistics", reportService.getLibraryStatistics(),
                "books", reportService.getBookReport(),
                "members", reportService.getMemberReport(),
                "transactions", reportService.getTransactionReport(),
                "fines", reportService.getFineReport()
            );
            return ResponseEntity.ok(dashboard);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
