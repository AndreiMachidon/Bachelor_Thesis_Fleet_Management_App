package com.fleetcore.fleetcorebackend.controller;

import com.fleetcore.fleetcorebackend.config.UserAuthProvider;
import com.fleetcore.fleetcorebackend.dto.SignInDto;
import com.fleetcore.fleetcorebackend.dto.SignUpDto;
import com.fleetcore.fleetcorebackend.dto.UserDto;
import com.fleetcore.fleetcorebackend.exceptions.AppException;
import com.fleetcore.fleetcorebackend.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;


@RequiredArgsConstructor
@RestController
public class AuthController {

    public final UserService userService;
    private final UserAuthProvider userAuthProvider;

    @PostMapping("/login")
    public ResponseEntity<UserDto> login(@RequestBody SignInDto signInDto){
        try{
            UserDto user = userService.login(signInDto);
            user.setToken(userAuthProvider.createToken(user));
            return ResponseEntity.ok(user);
        }catch (AppException ex){
            return ResponseEntity
                    .status(ex.getStatus())
                    .build();
        }

    }

    @PostMapping("/register")
    public ResponseEntity<UserDto> register(@RequestBody SignUpDto signUpDto){
        try{
            UserDto user = userService.register(signUpDto);
            user.setToken(userAuthProvider.createToken(user));
            return ResponseEntity.created(URI.create("/users/" + user.getId())).body(user);
        }catch (AppException ex){
            return ResponseEntity
                    .status(ex.getStatus())
                    .build();
        }

    }



}
