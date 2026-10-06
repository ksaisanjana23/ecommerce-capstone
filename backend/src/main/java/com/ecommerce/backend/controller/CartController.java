package com.ecommerce.backend.controller;

import com.ecommerce.backend.entity.Cart;
import com.ecommerce.backend.service.CartService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @GetMapping("/{userId}")
    public ResponseEntity<Cart> getCart(
            @PathVariable Long userId) {

        return ResponseEntity.ok(
                cartService.getCart(userId)
        );
    }

    @PostMapping("/{userId}/items")
    public ResponseEntity<Cart> addToCart(
            @PathVariable Long userId,
            @RequestBody Map<String, Object> request) {

        Long productId =
                Long.valueOf(request.get("productId").toString());

        Integer quantity =
                Integer.valueOf(request.get("quantity").toString());

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

        Integer quantity =
                Integer.valueOf(request.get("quantity").toString());

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

        return ResponseEntity.ok(
                cartService.removeItem(
                        userId,
                        itemId
                )
        );
    }
}