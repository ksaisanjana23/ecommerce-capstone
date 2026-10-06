package com.ecommerce.backend.service;

import com.ecommerce.backend.entity.*;
import com.ecommerce.backend.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final AddressRepository addressRepository;
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;

    public OrderService(
            OrderRepository orderRepository,
            UserRepository userRepository,
            AddressRepository addressRepository,
            CartRepository cartRepository,
            CartItemRepository cartItemRepository,
            ProductRepository productRepository) {

        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
        this.addressRepository = addressRepository;
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.productRepository = productRepository;
    }

    @Transactional
    public Order createOrder(Long userId, Long addressId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found with id: " + userId
                        ));

        Address address = addressRepository
                .findByIdAndUserId(addressId, userId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Address not found for this user"
                        ));

        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() ->
                        new RuntimeException("Cart not found"));

        if (cart.getItems() == null ||
                cart.getItems().isEmpty()) {

            throw new RuntimeException(
                    "Cannot create order because cart is empty"
            );
        }

        Order order = new Order();

        order.setUser(user);
        order.setAddress(address);
        order.setStatus("PENDING");

        BigDecimal totalAmount = BigDecimal.ZERO;

        for (CartItem cartItem : cart.getItems()) {

            Product product = cartItem.getProduct();
            int quantity = cartItem.getQuantity();

            if (quantity <= 0) {
                throw new RuntimeException(
                        "Invalid quantity for product: "
                                + product.getName()
                );
            }

            if (product.getStockQuantity() < quantity) {
                throw new RuntimeException(
                        "Insufficient stock for product: "
                                + product.getName()
                );
            }

            BigDecimal itemTotal =
                    product.getPrice().multiply(
                            BigDecimal.valueOf(quantity)
                    );

            totalAmount = totalAmount.add(itemTotal);

            OrderItem orderItem = new OrderItem(
                    order,
                    product,
                    quantity,
                    product.getPrice()
            );

            order.getItems().add(orderItem);
        }

        order.setTotalAmount(totalAmount);

        Order savedOrder = orderRepository.save(order);

        for (CartItem cartItem : cart.getItems()) {

            Product product = cartItem.getProduct();

            product.setStockQuantity(
                    product.getStockQuantity()
                            - cartItem.getQuantity()
            );

            productRepository.save(product);
        }

        cartItemRepository.deleteAll(
                List.copyOf(cart.getItems())
        );

        cart.getItems().clear();

        return savedOrder;
    }

    public List<Order> getUserOrders(Long userId) {

        if (!userRepository.existsById(userId)) {
            throw new RuntimeException(
                    "User not found with id: " + userId
            );
        }

        return orderRepository
                .findByUserIdOrderByOrderDateDesc(userId);
    }

    public Order getOrder(Long userId, Long orderId) {

        return orderRepository
                .findByIdAndUserId(orderId, userId)
                .orElseThrow(() ->
                        new RuntimeException("Order not found"));
    }

    @Transactional
    public Cart buyAgain(Long userId, Long orderId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        Order order = orderRepository
                .findByIdAndUserId(orderId, userId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Order not found for this user"
                        ));

        if (!"CONFIRMED".equalsIgnoreCase(order.getStatus())) {
            throw new RuntimeException(
                    "Only confirmed orders can be purchased again"
            );
        }

        Cart cart = cartRepository
                .findByUserId(userId)
                .orElseGet(() ->
                        cartRepository.save(new Cart(user))
                );

        for (OrderItem orderItem : order.getItems()) {

            Product product = orderItem.getProduct();

            if (product.getStockQuantity() <= 0) {
                continue;
            }

            int requestedQuantity = orderItem.getQuantity();

            int quantityToAdd = Math.min(
                    requestedQuantity,
                    product.getStockQuantity()
            );

            CartItem existingItem =
                    cartItemRepository
                            .findByCartIdAndProductId(
                                    cart.getId(),
                                    product.getId()
                            )
                            .orElse(null);

            if (existingItem != null) {

                int newQuantity =
                        existingItem.getQuantity()
                                + quantityToAdd;

                if (newQuantity >
                        product.getStockQuantity()) {

                    newQuantity =
                            product.getStockQuantity();
                }

                existingItem.setQuantity(newQuantity);

                cartItemRepository.save(existingItem);

            } else {

                CartItem newItem = new CartItem(
                        cart,
                        product,
                        quantityToAdd
                );

                cartItemRepository.save(newItem);
            }
        }

        return cartRepository
                .findByUserId(userId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Unable to load cart"
                        ));
    }

    @Transactional
    public Order cancelOrder(Long userId, Long orderId) {

        Order order = orderRepository
                .findByIdAndUserId(orderId, userId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Order not found for this user"
                        ));

        if (!"CONFIRMED".equalsIgnoreCase(order.getStatus())) {
            throw new RuntimeException(
                    "Only confirmed orders can be cancelled"
            );
        }

        if (order.getOrderDate() == null) {
            throw new RuntimeException(
                    "Order date is unavailable"
            );
        }

        LocalDateTime cancellationDeadline =
                order.getOrderDate().plusHours(48);

        if (LocalDateTime.now().isAfter(cancellationDeadline)) {
            throw new RuntimeException(
                    "The 48-hour cancellation period has expired"
            );
        }

        for (OrderItem orderItem : order.getItems()) {

            Product product = orderItem.getProduct();

            int currentStock =
                    product.getStockQuantity() == null
                            ? 0
                            : product.getStockQuantity();

            product.setStockQuantity(
                    currentStock + orderItem.getQuantity()
            );

            productRepository.save(product);
        }

        order.setStatus("CANCELLED");

        return orderRepository.save(order);
    }
}