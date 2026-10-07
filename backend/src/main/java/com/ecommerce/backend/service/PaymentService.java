package com.ecommerce.backend.service;

import com.ecommerce.backend.entity.Cart;
import com.ecommerce.backend.entity.CartItem;
import com.ecommerce.backend.entity.Order;
import com.ecommerce.backend.entity.OrderItem;
import com.ecommerce.backend.entity.Payment;
import com.ecommerce.backend.entity.Product;
import com.ecommerce.backend.exception.ResourceNotFoundException;
import com.ecommerce.backend.repository.CartItemRepository;
import com.ecommerce.backend.repository.CartRepository;
import com.ecommerce.backend.repository.OrderRepository;
import com.ecommerce.backend.repository.PaymentRepository;
import com.ecommerce.backend.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class PaymentService {

    private static final Set<String> ALLOWED_PAYMENT_METHODS =
            Set.of(
                    "UPI",
                    "CARD",
                    "NET_BANKING",
                    "COD"
            );

    private final PaymentRepository paymentRepository;
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final GiftPointService giftPointService;

    public PaymentService(
            PaymentRepository paymentRepository,
            OrderRepository orderRepository,
            ProductRepository productRepository,
            CartRepository cartRepository,
            CartItemRepository cartItemRepository,
            GiftPointService giftPointService) {

        this.paymentRepository = paymentRepository;
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
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
                        new ResourceNotFoundException(
                                "Order not found for this user"
                        ));

        if (paymentRepository.existsByOrderId(orderId)) {
            throw new IllegalArgumentException(
                    "Payment has already been completed for this order"
            );
        }

        if (!"PENDING".equalsIgnoreCase(order.getStatus())) {
            throw new IllegalArgumentException(
                    "Order is not eligible for payment"
            );
        }

        if (paymentMethod == null ||
                paymentMethod.trim().isEmpty()) {

            throw new IllegalArgumentException(
                    "Payment method is required"
            );
        }

        String normalizedPaymentMethod =
                paymentMethod.trim().toUpperCase();

        if (!ALLOWED_PAYMENT_METHODS.contains(
                normalizedPaymentMethod)) {

            throw new IllegalArgumentException(
                    "Unsupported payment method"
            );
        }

        /*
         * Revalidate every order item at payment time.
         *
         * The stock may have changed after the customer
         * originally entered checkout.
         */
        for (OrderItem orderItem : order.getItems()) {

            Product product = orderItem.getProduct();
            int quantity = orderItem.getQuantity();

            if (quantity <= 0) {
                throw new IllegalArgumentException(
                        "Invalid quantity for product: "
                                + product.getName()
                );
            }

            if (product.getStockQuantity() == null ||
                    product.getStockQuantity() < quantity) {

                throw new IllegalArgumentException(
                        "Insufficient stock for product: "
                                + product.getName()
                );
            }
        }

        /*
         * Payment has been accepted.
         *
         * Commit inventory changes inside this same
         * database transaction.
         */
        for (OrderItem orderItem : order.getItems()) {

            Product product = orderItem.getProduct();

            product.setStockQuantity(
                    product.getStockQuantity()
                            - orderItem.getQuantity()
            );

            productRepository.save(product);
        }

        /*
         * Remove only the products belonging to this order.
         *
         * This is safer than blindly clearing the entire
         * cart in case the cart changed after checkout.
         */
        cartRepository.findByUserId(userId)
                .ifPresent(cart ->
                        removePurchasedItems(
                                cart,
                                order
                        )
                );

        Payment payment = new Payment();

        payment.setOrder(order);
        payment.setAmount(order.getTotalAmount());
        payment.setPaymentMethod(
                normalizedPaymentMethod
        );
        payment.setStatus("SUCCESS");

        payment.setTransactionId(
                "TXN-"
                        + UUID.randomUUID()
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

    private void removePurchasedItems(
            Cart cart,
            Order order) {

        Set<Long> purchasedProductIds =
                order.getItems()
                        .stream()
                        .map(OrderItem::getProduct)
                        .map(Product::getId)
                        .collect(Collectors.toSet());

        List<CartItem> purchasedCartItems =
                cart.getItems()
                        .stream()
                        .filter(cartItem ->
                                purchasedProductIds.contains(
                                        cartItem
                                                .getProduct()
                                                .getId()
                                )
                        )
                        .toList();

        if (purchasedCartItems.isEmpty()) {
            return;
        }

        cartItemRepository.deleteAll(
                purchasedCartItems
        );

        cart.getItems()
                .removeAll(purchasedCartItems);
    }

    public Payment getPaymentForOrder(
            Long userId,
            Long orderId) {

        orderRepository
                .findByIdAndUserId(orderId, userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Order not found for this user"
                        ));

        return paymentRepository
                .findByOrderId(orderId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Payment not found for this order"
                        ));
    }
}