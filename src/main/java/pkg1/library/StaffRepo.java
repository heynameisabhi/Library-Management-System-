package pkg1.library;

import org.springframework.data.jpa.repository.JpaRepository;

public interface StaffRepo extends JpaRepository<StaffEntity, Integer> {

}
