package com.fleetcore.fleetcorebackend.services;

import com.fleetcore.fleetcorebackend.dto.SignInDto;
import com.fleetcore.fleetcorebackend.dto.SignUpDto;
import com.fleetcore.fleetcorebackend.dto.UserDto;
import com.fleetcore.fleetcorebackend.entities.User;
import com.fleetcore.fleetcorebackend.exceptions.AppException;
import com.fleetcore.fleetcorebackend.mappers.UserMapper;
import com.fleetcore.fleetcorebackend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
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

    private final UserMapper userMapper;


    public UserDto login(SignInDto signInDto) {
        System.out.println("User email: " + signInDto);
        User user = userRepository.findByEmail(signInDto.email())
                .orElseThrow(() -> new AppException("Unknown user", HttpStatus.NOT_FOUND));

        if (passwordEncoder.matches(CharBuffer.wrap(signInDto.password()), user.getPassword())) {
            return userMapper.toUserDto(user);
        }
        throw new AppException("Invalid password", HttpStatus.BAD_REQUEST);
    }

    public UserDto register(SignUpDto userDto) {
        Optional<User> optionalUser = userRepository.findByEmail(userDto.email());

        if (optionalUser.isPresent()) {
            throw new AppException("Login already exists", HttpStatus.CONFLICT);
        }

        User user = userMapper.signUpToUser(userDto);
        user.setPassword(passwordEncoder.encode(CharBuffer.wrap(userDto.password())));

        User savedUser = userRepository.save(user);

        return userMapper.toUserDto(savedUser);
    }
}
