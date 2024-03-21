package com.fleetcore.fleetcorebackend.controller;

import com.fleetcore.fleetcorebackend.dto.DriverDto;
import com.fleetcore.fleetcorebackend.dto.SignInDto;
import com.fleetcore.fleetcorebackend.dto.SignUpDto;
import com.fleetcore.fleetcorebackend.dto.UserDto;
import com.fleetcore.fleetcorebackend.exceptions.AuthException;
import com.fleetcore.fleetcorebackend.services.DriverService;
import com.fleetcore.fleetcorebackend.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;


@RequiredArgsConstructor
@RestController
public class AuthController {

    public final UserService userService;
    private final DriverService driverService;

    @PostMapping("/login")
    public ResponseEntity<UserDto> login(@RequestBody SignInDto signInDto) {
        try {
            UserDto user = userService.login(signInDto);
            return ResponseEntity.ok(user);
        } catch (AuthException ex) {
            return ResponseEntity
                    .status(ex.getStatus())
                    .build();
        }
    }

    @PostMapping("/register/admin")
    public ResponseEntity<UserDto> register(@RequestBody SignUpDto signUpDto) {
        try {
            UserDto user = userService.register(signUpDto);
            return ResponseEntity.created(URI.create("/users/")).body(user);
        } catch (AuthException ex) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .build();
        }
    }

    @PostMapping("register/driver")
    public ResponseEntity<DriverDto> registerDriver(@RequestParam("adminId") Long adminId, @RequestBody DriverDto driverDto) {
        try{
            DriverDto createdDriver = driverService.registerDriver(adminId, driverDto);
            return ResponseEntity.ok(createdDriver);
        }catch (AuthException ex){
            return ResponseEntity
                    .status(ex.getStatus())
                    .build();
        }
    }

    @GetMapping("/getImageData")
    public ResponseEntity<String> getImageData(@RequestParam("userId") Long userId){
        String imageData = userService.getImageData(userId);
        if(imageData != null){
            return ResponseEntity.ok(imageData);
        }else{
            return ResponseEntity.status(400).build();
        }
    }

}
