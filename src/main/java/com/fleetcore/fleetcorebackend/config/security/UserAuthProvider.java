package com.fleetcore.fleetcorebackend.config.security;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.fleetcore.fleetcorebackend.dto.DriverDto;
import com.fleetcore.fleetcorebackend.entities.User;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import java.util.Base64;
import java.util.Collections;
import java.util.Date;

@RequiredArgsConstructor
@Component
public class UserAuthProvider {

    @Value("${security.jwt.token.secret-key}")
    private String secretKey;

    @PostConstruct
    protected void init(){
        secretKey = Base64.getEncoder().encodeToString(secretKey.getBytes());
    }

    public String createTokenForAdmin(User user){

        Date now = new Date();
        Date validity = new Date(now.getTime() + 86_400_000);

        return JWT.create()
                .withIssuer(user.getEmail())
                .withIssuedAt(now)
                .withExpiresAt(validity)
                .withClaim("organisationName", user.getOrganisationName())
                .withClaim("firstName", user.getFirstName())
                .withClaim("lastName", user.getLastName())
                .withClaim("phoneNumber", user.getPhoneNumber())
                .withClaim("role", user.getRole())
                .withClaim("email", user.getEmail())
                .withClaim("id", user.getId())
                .sign(Algorithm.HMAC256(secretKey));
    }

    public String createTokenForDriver(DriverDto driverDto){
        Date now = new Date();
        Date validity = new Date(now.getTime() + 86_400_000);

        return JWT.create()
                .withIssuer(driverDto.getEmail())
                .withIssuedAt(now)
                .withExpiresAt(validity)
                .withClaim("organisationName", driverDto.getOrganisationName())
                .withClaim("firstName", driverDto.getFirstName())
                .withClaim("lastName", driverDto.getLastName())
                .withClaim("phoneNumber", driverDto.getPhoneNumber())
                .withClaim("role", driverDto.getRole())
                .withClaim("email", driverDto.getEmail())
                .withClaim("id", driverDto.getId())
                .withClaim("ratePerKilometer", driverDto.getRatePerKilometer())
                .withClaim("licenseExpiryDate", driverDto.getLicenseExpiryDate())
                .withClaim("yearsOfExperience", driverDto.getYearsOfExperience())
                .withClaim("totalKilometersDriven", driverDto.getTotalKilometersDriven())
                .sign(Algorithm.HMAC256(secretKey));
    }

    public  Authentication validateToken(String token){
        Algorithm algorithm = Algorithm.HMAC256(secretKey);

        JWTVerifier verifier = JWT.require(algorithm).build();

        DecodedJWT decoded = verifier.verify(token);

        User user = User.builder()
                .email(decoded.getIssuer())
                .organisationName(decoded.getClaim("organisationName").asString())
                .firstName(decoded.getClaim("firstName").asString())
                .lastName(decoded.getClaim("lastName").asString())
                .phoneNumber(decoded.getClaim("phoneNumber").asString())
                .role(decoded.getClaim("role").asString())
                .build();

        return new UsernamePasswordAuthenticationToken(user, null, Collections.emptyList());

    }

}
