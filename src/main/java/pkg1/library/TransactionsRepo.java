package pkg1.library;

import org.springframework.data.jpa.repository.JpaRepository;

public interface TransactionsRepo extends JpaRepository<TransactionsEntity, Integer>{

}
