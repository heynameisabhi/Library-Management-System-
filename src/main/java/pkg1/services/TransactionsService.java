package pkg1.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pkg1.library.TransactionsEntity;
import pkg1.library.TransactionsRepo;

import java.util.List;
import java.util.Optional;

@Service
public class TransactionsService {

    @Autowired
    private TransactionsRepo transactionsRepo;

    public List<TransactionsEntity> getAllTransactions() {
        return transactionsRepo.findAll();
    }

    public Optional<TransactionsEntity> getTransactionById(int id) {
        return transactionsRepo.findById(id);
    }

    public TransactionsEntity addTransaction(TransactionsEntity transaction) {
        return transactionsRepo.save(transaction);
    }

    public TransactionsEntity updateTransaction(int id, TransactionsEntity transaction) {
        transaction.setTransactionId(id);
        return transactionsRepo.save(transaction);
    }

    public void deleteTransaction(int id) {
        transactionsRepo.deleteById(id);
    }
}
