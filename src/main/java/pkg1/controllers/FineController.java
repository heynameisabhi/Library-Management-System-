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

import pkg1.library.FineEntity;
import pkg1.services.FineService;

@RestController
@RequestMapping("/fines")
public class FineController {

	@Autowired
	private FineService fineService;

	@GetMapping
	public List<FineEntity> getAllFines() {
	    return fineService.getAllFines();
	}

	@GetMapping("/{id}")
	public Optional<FineEntity> getFine(@PathVariable int id) {
	    return fineService.getFineById(id);
	}

	@PostMapping
	public FineEntity addFine(@RequestBody FineEntity fine) {
	    return fineService.addFine(fine);
	}

	@PutMapping("/{id}")
	public FineEntity updateFine(@PathVariable int id, @RequestBody FineEntity fine) {
	    return fineService.updateFine(id, fine);
	}

	@DeleteMapping("/{id}")
	public void deleteFine(@PathVariable int id) {
	    fineService.deleteFine(id);
	}

}
