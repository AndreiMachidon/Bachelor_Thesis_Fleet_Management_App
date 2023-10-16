package com.fleetcore.fleetcorebackend.util;

import java.security.SecureRandom;

public class DriverPasswordGenerator {

    private static final String CHAR_LOWER = "abcdefghijklmnopqrstuvwxyz";
    private static final String CHAR_UPPER = CHAR_LOWER.toUpperCase();
    private static final String DIGIT = "0123456789";
    private static final String PASSWORD_ALLOW = CHAR_LOWER + CHAR_UPPER + DIGIT;
    private static SecureRandom random = new SecureRandom();

    public static String generatePasswordForDriver() {
        StringBuilder sb = new StringBuilder(8);
        for (int i = 0; i < 8; i++) {
            int rndCharAt = random.nextInt(PASSWORD_ALLOW.length());
            char rndChar = PASSWORD_ALLOW.charAt(rndCharAt);
            sb.append(rndChar);
        }
        return sb.toString();
    }
}
