package com.ecommerce.backend.service;

import com.ecommerce.backend.entity.Brand;
import com.ecommerce.backend.repository.BrandRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BrandService {

    private final BrandRepository brandRepository;

    public BrandService(BrandRepository brandRepository) {
        this.brandRepository = brandRepository;
    }

    public Brand createBrand(Brand brand) {
        return brandRepository.save(brand);
    }

    public List<Brand> getAllBrands() {
        return brandRepository.findAll();
    }

    public Optional<Brand> getBrandById(Long id) {
        return brandRepository.findById(id);
    }

    public Brand updateBrand(Long id, Brand updatedBrand) {
        Brand existingBrand = brandRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Brand not found with id: " + id));

        existingBrand.setName(updatedBrand.getName());
        existingBrand.setDescription(updatedBrand.getDescription());

        return brandRepository.save(existingBrand);
    }

    public void deleteBrand(Long id) {
        if (!brandRepository.existsById(id)) {
            throw new RuntimeException("Brand not found with id: " + id);
        }

        brandRepository.deleteById(id);
    }
}