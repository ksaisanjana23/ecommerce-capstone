package com.ecommerce.backend.repository;

import com.ecommerce.backend.entity.GiftPoint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface GiftPointRepository
        extends JpaRepository<GiftPoint, Long> {

    Optional<GiftPoint> findByUserId(Long userId);
}