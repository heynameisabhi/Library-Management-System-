package pkg1.controllers;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import pkg1.library.StaffEntity;
import pkg1.services.StaffService;

@RestController
@RequestMapping("/staff")
public class StaffController {
	@Autowired
	private StaffService staffService;

	@GetMapping
	public List<StaffEntity> getAllStaff() {
	    return staffService.getAllStaff();
	}

	@GetMapping("/{id}")
	public Optional<StaffEntity> getStaff(@PathVariable int id) {
	    return staffService.getStaffById(id);
	}

	@PostMapping
	public StaffEntity addStaff(@RequestBody StaffEntity staff) {
	    return staffService.addStaff(staff);
	}

	@PutMapping("/{id}")
	public StaffEntity updateStaff(@PathVariable int id, @RequestBody StaffEntity staff) {
	    return staffService.updateStaff(id, staff);
	}

	@DeleteMapping("/{id}")
	public void deleteStaff(@PathVariable int id) {
	    staffService.deleteStaff(id);
	}


}
