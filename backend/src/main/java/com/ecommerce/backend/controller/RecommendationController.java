package com.ecommerce.backend.controller;

import com.ecommerce.backend.entity.Product;
import com.ecommerce.backend.service.RecommendationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recommendations")
public class RecommendationController {

    private final RecommendationService recommendationService;

    public RecommendationController(
            RecommendationService recommendationService) {

        this.recommendationService =
                recommendationService;
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<Product>> getRecommendations(
            @PathVariable Long userId) {

        List<Product> recommendations =
                recommendationService
                        .getRecommendations(userId);

        return ResponseEntity.ok(recommendations);
    }
}