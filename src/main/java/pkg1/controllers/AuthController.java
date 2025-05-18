package pkg1.controllers;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import pkg1.library.User;
import pkg1.library.UserRepo;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")  
public class AuthController {

    @Autowired
    private UserRepo userRepo;

  
    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        if (userRepo.findByEmail(user.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Email already exists.");
        }
        userRepo.save(user);
        return ResponseEntity.ok("User registered successfully!");
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody User loginData) {
        Optional<User> optionalUser = userRepo.findByEmail(loginData.getEmail());
        
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            if (user.getPassword().equals(loginData.getPassword())) {
                return ResponseEntity.ok(user); // success, return the user object
            } else {
                return ResponseEntity.status(401).body("Invalid password.");
            }
        } else {
            return ResponseEntity.status(401).body("User not found.");
        }
    }


}
