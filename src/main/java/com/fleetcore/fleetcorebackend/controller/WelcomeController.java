package com.fleetcore.fleetcorebackend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class WelcomeController {


    @GetMapping(path = "/greeting")
    public String getGreetings(){
        return "Hello World!";
    }
}
