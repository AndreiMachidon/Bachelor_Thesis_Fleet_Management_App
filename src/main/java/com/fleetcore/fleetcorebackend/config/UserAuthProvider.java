package com.fleetcore.fleetcorebackend.config;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.fleetcore.fleetcorebackend.dto.UserDto;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import java.net.Authenticator;
import java.util.Base64;
import java.util.Collections;
import java.util.Date;

@RequiredArgsConstructor
@Component
public class UserAuthProvider {

    @Value("${secutiry.jwt.token.secret-key:secrety-key}")
    private String secretKey;

    @PostConstruct
    protected void init(){
        secretKey = Base64.getEncoder().encodeToString(secretKey.getBytes());
    }


    
    public String createToken(UserDto dto){

        Date now = new Date();
        Date validity = new Date(now.getTime() + 3_600_600);

        return JWT.create()
                .withIssuer(dto.getEmail())
                .withIssuedAt(now)
                .withExpiresAt(validity)
                .withClaim("organisationName", dto.getOrganisationName())
                .withClaim("firstName", dto.getFirstName())
                .withClaim("lastName", dto.getLastName())
                .withClaim("phoneNumber", dto.getPhoneNumber())
                .withClaim("role", dto.getRole())
                .sign(Algorithm.HMAC256(secretKey));
    }

    public Authentication validateToken(String token){
        Algorithm algorithm = Algorithm.HMAC256(secretKey);

        JWTVerifier verifier = JWT.require(algorithm).build();

        DecodedJWT decoded = verifier.verify(token);

        UserDto user = UserDto.builder()
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
