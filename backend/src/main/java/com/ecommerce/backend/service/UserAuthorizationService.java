package com.ecommerce.backend.service;

import com.ecommerce.backend.entity.User;
import com.ecommerce.backend.repository.UserRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class UserAuthorizationService {

    private final UserRepository userRepository;

    public UserAuthorizationService(
            UserRepository userRepository) {

        this.userRepository = userRepository;
    }

    public User getAuthenticatedUser() {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        if (authentication == null ||
                !authentication.isAuthenticated()) {

            throw new AccessDeniedException(
                    "Authentication required."
            );
        }

        String email = authentication.getName();

        return userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new AccessDeniedException(
                                "Authenticated user not found."
                        ));
    }

    public User authorizeUser(Long requestedUserId) {

        User authenticatedUser =
                getAuthenticatedUser();

        if (!authenticatedUser
                .getId()
                .equals(requestedUserId)) {

            throw new AccessDeniedException(
                    "You are not authorized to access this user's resources."
            );
        }

        return authenticatedUser;
    }
}