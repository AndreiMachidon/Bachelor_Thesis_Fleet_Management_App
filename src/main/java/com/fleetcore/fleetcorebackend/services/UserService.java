package com.fleetcore.fleetcorebackend.services;

import com.fleetcore.fleetcorebackend.config.UserAuthProvider;
import com.fleetcore.fleetcorebackend.dto.DriverDto;
import com.fleetcore.fleetcorebackend.dto.SignInDto;
import com.fleetcore.fleetcorebackend.dto.SignUpDto;
import com.fleetcore.fleetcorebackend.dto.UserDto;
import com.fleetcore.fleetcorebackend.entities.User;
import com.fleetcore.fleetcorebackend.exceptions.AppException;
import com.fleetcore.fleetcorebackend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.nio.CharBuffer;
import java.util.Optional;

@RequiredArgsConstructor
@Service
public class UserService {

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    private final DriverService driverService;

    private final UserAuthProvider userAuthProvider;


    public UserDto login(SignInDto signInDto) {
        System.out.println("User email: " + signInDto);
        User user = userRepository.findByEmail(signInDto.email())
                .orElseThrow(() -> new AppException("Unknown user", HttpStatus.NOT_FOUND));
        UserDto userDto = new UserDto();
        if (passwordEncoder.matches(CharBuffer.wrap(signInDto.password()), user.getPassword())) {
            if(user.getRole().equals("admin")){
                userDto.setToken(userAuthProvider.createTokenForAdmin(user));
                return userDto;
            }else{
                DriverDto driverDto = driverService.createDriverDtoForLogin(user);
                userDto.setToken(userAuthProvider.createTokenForDriver(driverDto));
                return userDto;
            }
        }
        throw new AppException("Invalid password", HttpStatus.BAD_REQUEST);
    }

    public UserDto register(SignUpDto signUpDto) {
        Optional<User> optionalUser = userRepository.findByEmail(signUpDto.email());

        if (optionalUser.isPresent()) {
            throw new AppException("Login already exists", HttpStatus.CONFLICT);
        }

        User user = new User();
        user.setOrganisationName(signUpDto.organisationName());
        user.setFirstName(signUpDto.firstName());
        user.setLastName(signUpDto.lastName());
        user.setPassword(signUpDto.phoneNumber());
        user.setEmail(signUpDto.email());
        user.setRole(signUpDto.email());
        user.setPassword(passwordEncoder.encode(CharBuffer.wrap(signUpDto.password())));

        userRepository.save(user);

        UserDto userDto = new UserDto();
        userDto.setToken(userAuthProvider.createTokenForAdmin(user));

        return userDto;
    }
}
