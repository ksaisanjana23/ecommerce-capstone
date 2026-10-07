package com.ecommerce.backend.controller;

import com.ecommerce.backend.entity.Cart;
import com.ecommerce.backend.service.CartService;
import com.ecommerce.backend.service.UserAuthorizationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;
    private final UserAuthorizationService userAuthorizationService;

    public CartController(
            CartService cartService,
            UserAuthorizationService userAuthorizationService) {

        this.cartService = cartService;
        this.userAuthorizationService = userAuthorizationService;
    }

    @GetMapping("/{userId}")
    public ResponseEntity<Cart> getCart(
            @PathVariable Long userId) {

        userAuthorizationService.authorizeUser(userId);

        return ResponseEntity.ok(
                cartService.getCart(userId)
        );
    }

    @PostMapping("/{userId}/items")
    public ResponseEntity<Cart> addToCart(
            @PathVariable Long userId,
            @RequestBody Map<String, Object> request) {

        userAuthorizationService.authorizeUser(userId);

        Long productId =
                Long.valueOf(
                        request.get("productId").toString()
                );

        Integer quantity =
                Integer.valueOf(
                        request.get("quantity").toString()
                );

        return ResponseEntity.ok(
                cartService.addToCart(
                        userId,
                        productId,
                        quantity
                )
        );
    }

    @PutMapping("/{userId}/items/{itemId}")
    public ResponseEntity<Cart> updateQuantity(
            @PathVariable Long userId,
            @PathVariable Long itemId,
            @RequestBody Map<String, Object> request) {

        userAuthorizationService.authorizeUser(userId);

        Integer quantity =
                Integer.valueOf(
                        request.get("quantity").toString()
                );

        return ResponseEntity.ok(
                cartService.updateQuantity(
                        userId,
                        itemId,
                        quantity
                )
        );
    }

    @DeleteMapping("/{userId}/items/{itemId}")
    public ResponseEntity<Cart> removeItem(
            @PathVariable Long userId,
            @PathVariable Long itemId) {

        userAuthorizationService.authorizeUser(userId);

        return ResponseEntity.ok(
                cartService.removeItem(
                        userId,
                        itemId
                )
        );
    }
}