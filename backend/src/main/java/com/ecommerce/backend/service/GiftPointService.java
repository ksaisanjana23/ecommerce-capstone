package com.ecommerce.backend.service;

import com.ecommerce.backend.entity.GiftPoint;
import com.ecommerce.backend.entity.User;
import com.ecommerce.backend.repository.GiftPointRepository;
import com.ecommerce.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
public class GiftPointService {

    private final GiftPointRepository giftPointRepository;
    private final UserRepository userRepository;

    public GiftPointService(
            GiftPointRepository giftPointRepository,
            UserRepository userRepository) {

        this.giftPointRepository = giftPointRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public GiftPoint awardPoints(
            Long userId,
            BigDecimal amount) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found with id: " + userId
                        ));

        int earnedPoints =
                amount.divideToIntegralValue(
                        BigDecimal.valueOf(100)
                ).intValue();

        GiftPoint giftPoint =
                giftPointRepository
                        .findByUserId(userId)
                        .orElseGet(() ->
                                new GiftPoint(user)
                        );

        int currentPoints =
                giftPoint.getPoints() == null
                        ? 0
                        : giftPoint.getPoints();

        giftPoint.setPoints(
                currentPoints + earnedPoints
        );

        return giftPointRepository.save(giftPoint);
    }

    public GiftPoint getGiftPoints(Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found with id: " + userId
                        ));

        return giftPointRepository
                .findByUserId(userId)
                .orElseGet(() ->
                        giftPointRepository.save(
                                new GiftPoint(user)
                        )
                );
    }
}
