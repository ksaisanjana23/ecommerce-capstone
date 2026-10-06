package com.ecommerce.backend.service;

import com.ecommerce.backend.entity.Address;
import com.ecommerce.backend.entity.User;
import com.ecommerce.backend.repository.AddressRepository;
import com.ecommerce.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AddressService {

    private final AddressRepository addressRepository;
    private final UserRepository userRepository;

    public AddressService(
            AddressRepository addressRepository,
            UserRepository userRepository) {

        this.addressRepository = addressRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public Address createAddress(
            Long userId,
            Address address) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found with id: " + userId
                        ));

        address.setId(null);
        address.setUser(user);

        return addressRepository.save(address);
    }

    public List<Address> getUserAddresses(Long userId) {

        if (!userRepository.existsById(userId)) {
            throw new RuntimeException(
                    "User not found with id: " + userId
            );
        }

        return addressRepository
                .findByUserIdOrderByIdAsc(userId);
    }

    public Address getAddress(
            Long userId,
            Long addressId) {

        return addressRepository
                .findByIdAndUserId(addressId, userId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Address not found"
                        ));
    }

    @Transactional
    public Address updateAddress(
            Long userId,
            Long addressId,
            Address updatedAddress) {

        Address existingAddress =
                addressRepository
                        .findByIdAndUserId(addressId, userId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Address not found"
                                ));

        existingAddress.setFullName(
                updatedAddress.getFullName()
        );

        existingAddress.setPhone(
                updatedAddress.getPhone()
        );

        existingAddress.setAddressLine1(
                updatedAddress.getAddressLine1()
        );

        existingAddress.setAddressLine2(
                updatedAddress.getAddressLine2()
        );

        existingAddress.setCity(
                updatedAddress.getCity()
        );

        existingAddress.setState(
                updatedAddress.getState()
        );

        existingAddress.setPostalCode(
                updatedAddress.getPostalCode()
        );

        existingAddress.setCountry(
                updatedAddress.getCountry()
        );

        return addressRepository.save(existingAddress);
    }

    @Transactional
    public void deleteAddress(
            Long userId,
            Long addressId) {

        Address address =
                addressRepository
                        .findByIdAndUserId(addressId, userId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Address not found"
                                ));

        addressRepository.delete(address);
    }
}