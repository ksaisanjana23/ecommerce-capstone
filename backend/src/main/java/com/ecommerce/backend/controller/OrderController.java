package com.ecommerce.backend.controller;

import com.ecommerce.backend.entity.Cart;
import com.ecommerce.backend.entity.Order;
import com.ecommerce.backend.service.OrderService;
import com.ecommerce.backend.service.UserAuthorizationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;
    private final UserAuthorizationService userAuthorizationService;

    public OrderController(
            OrderService orderService,
            UserAuthorizationService userAuthorizationService) {

        this.orderService = orderService;
        this.userAuthorizationService = userAuthorizationService;
    }

    @PostMapping("/{userId}")
    public ResponseEntity<Order> createOrder(
            @PathVariable Long userId,
            @RequestBody Map<String, Object> request) {

        userAuthorizationService.authorizeUser(userId);

        Long addressId = Long.valueOf(
                request.get("addressId").toString()
        );

        Order order = orderService.createOrder(
                userId,
                addressId
        );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(order);
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<Order>> getUserOrders(
            @PathVariable Long userId) {

        userAuthorizationService.authorizeUser(userId);

        return ResponseEntity.ok(
                orderService.getUserOrders(userId)
        );
    }

    @GetMapping("/{userId}/{orderId}")
    public ResponseEntity<Order> getOrder(
            @PathVariable Long userId,
            @PathVariable Long orderId) {

        userAuthorizationService.authorizeUser(userId);

        return ResponseEntity.ok(
                orderService.getOrder(
                        userId,
                        orderId
                )
        );
    }

    @PostMapping("/{userId}/{orderId}/buy-again")
    public ResponseEntity<Cart> buyAgain(
            @PathVariable Long userId,
            @PathVariable Long orderId) {

        userAuthorizationService.authorizeUser(userId);

        Cart cart = orderService.buyAgain(
                userId,
                orderId
        );

        return ResponseEntity.ok(cart);
    }

    @PutMapping("/{userId}/{orderId}/cancel")
    public ResponseEntity<Order> cancelOrder(
            @PathVariable Long userId,
            @PathVariable Long orderId) {

        userAuthorizationService.authorizeUser(userId);

        Order cancelledOrder =
                orderService.cancelOrder(
                        userId,
                        orderId
                );

        return ResponseEntity.ok(cancelledOrder);
    }
}