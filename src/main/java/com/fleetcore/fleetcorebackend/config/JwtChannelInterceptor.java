package com.fleetcore.fleetcorebackend.config;

import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

/**
 * Interceptor for STOMP connections used for securing the sockets connection to the server.
 */
public class JwtChannelInterceptor implements ChannelInterceptor {


    private final UserAuthProvider userAuthProvider;

    public JwtChannelInterceptor(UserAuthProvider userAuthenticationProvider) {
        this.userAuthProvider = userAuthenticationProvider;
    }

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

        if (StompCommand.CONNECT.equals(accessor.getCommand())) {
            String jwtToken = accessor.getFirstNativeHeader("Authorization");
            if (jwtToken != null && jwtToken.startsWith("Bearer ")) {
                try {
                    String token = jwtToken.substring(7);
                    Authentication authentication = userAuthProvider.validateToken(token);
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                } catch (RuntimeException e) {
                    SecurityContextHolder.clearContext();
                }
            }
        }

        return message;
    }
}

