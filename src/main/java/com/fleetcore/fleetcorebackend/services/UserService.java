package com.fleetcore.fleetcorebackend.services;

import com.fleetcore.fleetcorebackend.config.security.PasswordConfig;
import com.fleetcore.fleetcorebackend.config.security.UserAuthProvider;
import com.fleetcore.fleetcorebackend.dto.DriverDto;
import com.fleetcore.fleetcorebackend.dto.SignInDto;
import com.fleetcore.fleetcorebackend.dto.SignUpDto;
import com.fleetcore.fleetcorebackend.dto.UserDto;
import com.fleetcore.fleetcorebackend.entities.User;
import com.fleetcore.fleetcorebackend.exceptions.AuthException;
import com.fleetcore.fleetcorebackend.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.nio.CharBuffer;
import java.util.Optional;

@RequiredArgsConstructor
@Service
public class UserService {

    private final UserRepository userRepository;

    private final PasswordConfig passwordConfig;

    private final DriverService driverService;

    private final UserAuthProvider userAuthProvider;

    Logger logger = LoggerFactory.getLogger(UserService.class);


    public UserDto login(SignInDto signInDto) {
        logger.info("Sign in user with email: " + signInDto);

        User user = userRepository.findByEmail(signInDto.email())
                .orElseThrow(() -> new AuthException("Unknown user", HttpStatus.NOT_FOUND));

        UserDto userDto = new UserDto();
        if (passwordConfig.passwordEncoder().matches(CharBuffer.wrap(signInDto.password()), user.getPassword())) {
            if (user.getRole().equals("admin")) {
                logger.info("Signing in an user with admin rights");
                userDto.setToken(userAuthProvider.createTokenForAdmin(user));
                return userDto;
            } else {
                logger.info("Signing in a driver");
                DriverDto driverDto = driverService.createDriverDtoForLogin(user);
                userDto.setToken(userAuthProvider.createTokenForDriver(driverDto));
                return userDto;
            }
        }else{
            throw new AuthException("Invalid password", HttpStatus.BAD_REQUEST);
        }
    }

    public UserDto register(SignUpDto signUpDto){
        Optional<User> optionalUser = userRepository.findByEmail(signUpDto.email());

        if (optionalUser.isPresent()) {
            throw new AuthException("Email address already in use", HttpStatus.CONFLICT);
        }

        User user = new User();
        user.setOrganisationName(signUpDto.organisationName());
        user.setFirstName(signUpDto.firstName());
        user.setLastName(signUpDto.lastName());
        user.setPassword(signUpDto.phoneNumber());
        user.setEmail(signUpDto.email());
        user.setRole(signUpDto.role());
        user.setPhoneNumber(signUpDto.phoneNumber());
        user.setPassword(passwordConfig.passwordEncoder().encode(CharBuffer.wrap(signUpDto.password())));
        userRepository.save(user);
        UserDto userDto = new UserDto();
        userDto.setToken(userAuthProvider.createTokenForAdmin(user));

        return userDto;
    }

    public String getImageData(Long userId){
        User user = userRepository.findUserById(userId);
        return user.getImageData();
    }

    public void updateUserDetails(User newUser) {
        User existingUser = userRepository.findUserById(newUser.getId());
        if(newUser.getPassword().isEmpty()) {
            newUser.setPassword(existingUser.getPassword());
        } else {
            String encodedPassword = passwordConfig.passwordEncoder().encode(newUser.getPassword());
            newUser.setPassword(encodedPassword);
        }

        if(newUser.getImageData() == null) {
            newUser.setImageData(existingUser.getImageData());
        }

        userRepository.save(newUser);
    }
}
