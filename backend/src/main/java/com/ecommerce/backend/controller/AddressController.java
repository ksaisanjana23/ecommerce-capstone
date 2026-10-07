package com.ecommerce.backend.controller;

import com.ecommerce.backend.entity.Address;
import com.ecommerce.backend.service.AddressService;
import com.ecommerce.backend.service.UserAuthorizationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/addresses")
public class AddressController {

    private final AddressService addressService;
    private final UserAuthorizationService userAuthorizationService;

    public AddressController(
            AddressService addressService,
            UserAuthorizationService userAuthorizationService) {

        this.addressService = addressService;
        this.userAuthorizationService = userAuthorizationService;
    }

    @PostMapping("/{userId}")
    public ResponseEntity<Address> createAddress(
            @PathVariable Long userId,
            @RequestBody Address address) {

        userAuthorizationService.authorizeUser(userId);

        Address createdAddress =
                addressService.createAddress(
                        userId,
                        address
                );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(createdAddress);
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<Address>> getUserAddresses(
            @PathVariable Long userId) {

        userAuthorizationService.authorizeUser(userId);

        return ResponseEntity.ok(
                addressService.getUserAddresses(userId)
        );
    }

    @GetMapping("/{userId}/{addressId}")
    public ResponseEntity<Address> getAddress(
            @PathVariable Long userId,
            @PathVariable Long addressId) {

        userAuthorizationService.authorizeUser(userId);

        return ResponseEntity.ok(
                addressService.getAddress(
                        userId,
                        addressId
                )
        );
    }

    @PutMapping("/{userId}/{addressId}")
    public ResponseEntity<Address> updateAddress(
            @PathVariable Long userId,
            @PathVariable Long addressId,
            @RequestBody Address address) {

        userAuthorizationService.authorizeUser(userId);

        return ResponseEntity.ok(
                addressService.updateAddress(
                        userId,
                        addressId,
                        address
                )
        );
    }

    @DeleteMapping("/{userId}/{addressId}")
    public ResponseEntity<Void> deleteAddress(
            @PathVariable Long userId,
            @PathVariable Long addressId) {

        userAuthorizationService.authorizeUser(userId);

        addressService.deleteAddress(
                userId,
                addressId
        );

        return ResponseEntity
                .noContent()
                .build();
    }
}