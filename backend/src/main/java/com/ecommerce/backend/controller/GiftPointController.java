package com.ecommerce.backend.controller;

import com.ecommerce.backend.entity.GiftPoint;
import com.ecommerce.backend.service.GiftPointService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/gift-points")
public class GiftPointController {

    private final GiftPointService giftPointService;

    public GiftPointController(
            GiftPointService giftPointService) {
        this.giftPointService = giftPointService;
    }

    @GetMapping("/{userId}")
    public ResponseEntity<GiftPoint> getGiftPoints(
            @PathVariable Long userId) {

        return ResponseEntity.ok(
                giftPointService.getGiftPoints(userId)
        );
    }
}