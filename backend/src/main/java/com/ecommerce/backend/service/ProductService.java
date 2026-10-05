package com.ecommerce.backend.service;

import com.ecommerce.backend.entity.Brand;
import com.ecommerce.backend.entity.Category;
import com.ecommerce.backend.entity.Product;
import com.ecommerce.backend.repository.BrandRepository;
import com.ecommerce.backend.repository.CategoryRepository;
import com.ecommerce.backend.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final BrandRepository brandRepository;

    public ProductService(
            ProductRepository productRepository,
            CategoryRepository categoryRepository,
            BrandRepository brandRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.brandRepository = brandRepository;
    }

    public Product createProduct(Product product) {

        Long categoryId = product.getCategory().getId();
        Long brandId = product.getBrand().getId();

        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() ->
                        new RuntimeException("Category not found with id: " + categoryId));

        Brand brand = brandRepository.findById(brandId)
                .orElseThrow(() ->
                        new RuntimeException("Brand not found with id: " + brandId));

        product.setCategory(category);
        product.setBrand(brand);

        return productRepository.save(product);
    }

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public List<Product> getProductsByCategory(Long categoryId) {
        return productRepository.findByCategoryId(categoryId);
    }

    public List<Product> getProductsByBrand(Long brandId) {
        return productRepository.findByBrandId(brandId);
    }

    public Optional<Product> getProductById(Long id) {
        return productRepository.findById(id);
    }

    public Product updateProduct(Long id, Product updatedProduct) {

        Product existingProduct = productRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Product not found with id: " + id));

        Long categoryId = updatedProduct.getCategory().getId();
        Long brandId = updatedProduct.getBrand().getId();

        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() ->
                        new RuntimeException("Category not found with id: " + categoryId));

        Brand brand = brandRepository.findById(brandId)
                .orElseThrow(() ->
                        new RuntimeException("Brand not found with id: " + brandId));

        existingProduct.setName(updatedProduct.getName());
        existingProduct.setDescription(updatedProduct.getDescription());
        existingProduct.setPrice(updatedProduct.getPrice());
        existingProduct.setStockQuantity(updatedProduct.getStockQuantity());
        existingProduct.setImageUrl(updatedProduct.getImageUrl());
        existingProduct.setCategory(category);
        existingProduct.setBrand(brand);

        return productRepository.save(existingProduct);
    }

    public void deleteProduct(Long id) {

        if (!productRepository.existsById(id)) {
            throw new RuntimeException("Product not found with id: " + id);
        }

        productRepository.deleteById(id);
    }
}