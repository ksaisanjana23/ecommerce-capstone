package com.ecommerce.backend.controller;

import com.ecommerce.backend.entity.GiftPoint;
import com.ecommerce.backend.service.GiftPointService;
import com.ecommerce.backend.service.UserAuthorizationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/gift-points")
public class GiftPointController {

    private final GiftPointService giftPointService;
    private final UserAuthorizationService userAuthorizationService;

    public GiftPointController(
            GiftPointService giftPointService,
            UserAuthorizationService userAuthorizationService) {

        this.giftPointService = giftPointService;
        this.userAuthorizationService = userAuthorizationService;
    }

    @GetMapping("/{userId}")
    public ResponseEntity<GiftPoint> getGiftPoints(
            @PathVariable Long userId) {

        userAuthorizationService.authorizeUser(userId);

        return ResponseEntity.ok(
                giftPointService.getGiftPoints(userId)
        );
    }
}