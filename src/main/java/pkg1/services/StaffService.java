package pkg1.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pkg1.library.StaffEntity;
import pkg1.library.StaffRepo;

import java.util.List;
import java.util.Optional;

@Service
public class StaffService {

    @Autowired
    private StaffRepo staffRepo;

    public List<StaffEntity> getAllStaff() {
        return staffRepo.findAll();
    }

    public Optional<StaffEntity> getStaffById(int id) {
        return staffRepo.findById(id);
    }

    public StaffEntity addStaff(StaffEntity staff) {
        return staffRepo.save(staff);
    }

    public StaffEntity updateStaff(int id, StaffEntity staff) {
        staff.setStaffid(id);
        return staffRepo.save(staff);
    }

    public void deleteStaff(int id) {
        staffRepo.deleteById(id);
    }
}
