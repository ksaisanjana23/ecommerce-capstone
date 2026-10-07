package com.ecommerce.backend.service;

import com.ecommerce.backend.entity.GiftPoint;
import com.ecommerce.backend.entity.User;
import com.ecommerce.backend.exception.ResourceNotFoundException;
import com.ecommerce.backend.repository.GiftPointRepository;
import com.ecommerce.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
public class GiftPointService {

    private static final BigDecimal RUPEES_PER_POINT =
            BigDecimal.valueOf(100);

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

        validateAmount(amount);

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found with id: " + userId
                        ));

        int earnedPoints = calculatePoints(amount);

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

    @Transactional
    public GiftPoint reversePoints(
            Long userId,
            BigDecimal amount) {

        validateAmount(amount);

        GiftPoint giftPoint =
                giftPointRepository
                        .findByUserId(userId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Gift points not found for this user"
                                ));

        int pointsToReverse =
                calculatePoints(amount);

        int currentPoints =
                giftPoint.getPoints() == null
                        ? 0
                        : giftPoint.getPoints();

        /*
         * Never allow a negative rewards balance.
         */
        giftPoint.setPoints(
                Math.max(
                        0,
                        currentPoints - pointsToReverse
                )
        );

        return giftPointRepository.save(giftPoint);
    }

    public GiftPoint getGiftPoints(Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
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

    private int calculatePoints(BigDecimal amount) {

        return amount.divideToIntegralValue(
                RUPEES_PER_POINT
        ).intValue();
    }

    private void validateAmount(BigDecimal amount) {

        if (amount == null ||
                amount.compareTo(BigDecimal.ZERO) < 0) {

            throw new IllegalArgumentException(
                    "Amount must be zero or greater"
            );
        }
    }
}