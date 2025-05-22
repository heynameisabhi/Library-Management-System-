package pkg1.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pkg1.library.FineEntity;
import pkg1.library.FineRepo;

import java.util.List;
import java.util.Optional;

@Service
public class FineService {

    @Autowired
    private FineRepo fineRepo;

    public List<FineEntity> getAllFines() {
        return fineRepo.findAll();
    }

    public Optional<FineEntity> getFineById(int id) {
        return fineRepo.findById(id);
    }

    public FineEntity addFine(FineEntity fine) {
        return fineRepo.save(fine);
    }

    public FineEntity updateFine(int id, FineEntity fine) {
        fine.setFineid(id);
        return fineRepo.save(fine);
    }

    public void deleteFine(int id) {
        fineRepo.deleteById(id);
    }
}