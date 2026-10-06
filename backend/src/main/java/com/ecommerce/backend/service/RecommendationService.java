package com.ecommerce.backend.service;

import com.ecommerce.backend.entity.Order;
import com.ecommerce.backend.entity.OrderItem;
import com.ecommerce.backend.entity.Product;
import com.ecommerce.backend.repository.OrderRepository;
import com.ecommerce.backend.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

@Service
public class RecommendationService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;

    public RecommendationService(
            OrderRepository orderRepository,
            ProductRepository productRepository) {

        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
    }

    public List<Product> getRecommendations(Long userId) {

        List<Order> orders =
                orderRepository
                        .findByUserIdOrderByOrderDateDesc(userId);

        Set<Long> purchasedProductIds = new HashSet<>();
        Set<Long> purchasedCategoryIds = new LinkedHashSet<>();

        for (Order order : orders) {

            if (!"CONFIRMED".equalsIgnoreCase(
                    order.getStatus())) {
                continue;
            }

            for (OrderItem item : order.getItems()) {

                Product product = item.getProduct();

                if (product == null) {
                    continue;
                }

                purchasedProductIds.add(product.getId());

                if (product.getCategory() != null) {
                    purchasedCategoryIds.add(
                            product.getCategory().getId()
                    );
                }
            }
        }

        List<Product> recommendations =
                new ArrayList<>();

        Set<Long> recommendationIds =
                new HashSet<>();

        for (Long categoryId : purchasedCategoryIds) {

            List<Product> categoryProducts =
                    productRepository
                            .findByCategoryId(categoryId);

            for (Product product : categoryProducts) {

                if (purchasedProductIds.contains(
                        product.getId())) {
                    continue;
                }

                if (product.getStockQuantity() == null ||
                        product.getStockQuantity() <= 0) {
                    continue;
                }

                if (recommendationIds.add(
                        product.getId())) {

                    recommendations.add(product);
                }
            }
        }

        return recommendations;
    }
}