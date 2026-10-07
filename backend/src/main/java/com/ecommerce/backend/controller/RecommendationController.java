package com.ecommerce.backend.controller;

import com.ecommerce.backend.entity.Product;
import com.ecommerce.backend.service.RecommendationService;
import com.ecommerce.backend.service.UserAuthorizationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recommendations")
public class RecommendationController {

    private final RecommendationService recommendationService;
    private final UserAuthorizationService userAuthorizationService;

    public RecommendationController(
            RecommendationService recommendationService,
            UserAuthorizationService userAuthorizationService) {

        this.recommendationService =
                recommendationService;

        this.userAuthorizationService =
                userAuthorizationService;
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<Product>> getRecommendations(
            @PathVariable Long userId) {

        userAuthorizationService.authorizeUser(userId);

        List<Product> recommendations =
                recommendationService
                        .getRecommendations(userId);

        return ResponseEntity.ok(recommendations);
    }
}