package com.ecommerce.backend.controller;

import com.ecommerce.backend.entity.Payment;
import com.ecommerce.backend.service.PaymentService;
import com.ecommerce.backend.service.UserAuthorizationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;
    private final UserAuthorizationService userAuthorizationService;

    public PaymentController(
            PaymentService paymentService,
            UserAuthorizationService userAuthorizationService) {

        this.paymentService = paymentService;
        this.userAuthorizationService = userAuthorizationService;
    }

    @PostMapping("/{userId}/orders/{orderId}")
    public ResponseEntity<Payment> processPayment(
            @PathVariable Long userId,
            @PathVariable Long orderId,
            @RequestBody Map<String, String> request) {

        userAuthorizationService.authorizeUser(userId);

        String paymentMethod =
                request.get("paymentMethod");

        Payment payment =
                paymentService.processPayment(
                        userId,
                        orderId,
                        paymentMethod
                );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(payment);
    }

    @GetMapping("/{userId}/orders/{orderId}")
    public ResponseEntity<Payment> getPayment(
            @PathVariable Long userId,
            @PathVariable Long orderId) {

        userAuthorizationService.authorizeUser(userId);

        return ResponseEntity.ok(
                paymentService.getPaymentForOrder(
                        userId,
                        orderId
                )
        );
    }
}