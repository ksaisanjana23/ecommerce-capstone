package com.ecommerce.backend.service;

import com.ecommerce.backend.entity.Order;
import com.ecommerce.backend.entity.Payment;
import com.ecommerce.backend.repository.OrderRepository;
import com.ecommerce.backend.repository.PaymentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final OrderRepository orderRepository;
    private final GiftPointService giftPointService;

    public PaymentService(
            PaymentRepository paymentRepository,
            OrderRepository orderRepository,
            GiftPointService giftPointService) {

        this.paymentRepository = paymentRepository;
        this.orderRepository = orderRepository;
        this.giftPointService = giftPointService;
    }

    @Transactional
    public Payment processPayment(
            Long userId,
            Long orderId,
            String paymentMethod) {

        Order order = orderRepository
                .findByIdAndUserId(orderId, userId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Order not found for this user"
                        ));

        if (paymentRepository.existsByOrderId(orderId)) {
            throw new RuntimeException(
                    "Payment has already been completed for this order"
            );
        }

        if (!"PENDING".equalsIgnoreCase(order.getStatus())) {
            throw new RuntimeException(
                    "Order is not eligible for payment"
            );
        }

        if (paymentMethod == null ||
                paymentMethod.trim().isEmpty()) {

            throw new RuntimeException(
                    "Payment method is required"
            );
        }

        Payment payment = new Payment();

        payment.setOrder(order);
        payment.setAmount(order.getTotalAmount());

        payment.setPaymentMethod(
                paymentMethod.trim().toUpperCase()
        );

        payment.setStatus("SUCCESS");

        payment.setTransactionId(
                "TXN-" +
                        UUID.randomUUID()
                                .toString()
                                .replace("-", "")
                                .substring(0, 12)
                                .toUpperCase()
        );

        Payment savedPayment =
                paymentRepository.save(payment);

        order.setStatus("CONFIRMED");
        orderRepository.save(order);

        // Award 1 Gift Point for every ₹100 paid.
        giftPointService.awardPoints(
                userId,
                order.getTotalAmount()
        );

        return savedPayment;
    }

    public Payment getPaymentForOrder(
            Long userId,
            Long orderId) {

        orderRepository
                .findByIdAndUserId(orderId, userId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Order not found for this user"
                        ));

        return paymentRepository
                .findByOrderId(orderId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Payment not found for this order"
                        ));
    }
}