package pkg1.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pkg1.library.User;
import pkg1.library.UserRepo;

@Service
public class AuthService {

    @Autowired
    private UserRepo userRepo;

    public User authenticate(String email, String password) {
        User user = userRepo.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));

        if (!user.getPassword().equals(password)) {
            throw new RuntimeException("Invalid password");
        }

        return user;
    }
}
