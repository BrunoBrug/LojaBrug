package com.lojabrug.api.product;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class ProductCatalogTest {
    @Test
    void catalogContainsSixInitialProducts() {
        ProductCatalog catalog = new ProductCatalog();

        assertThat(catalog.findAll()).hasSize(6);
        assertThat(catalog.findById("camiseta-essencial")).isPresent();
        assertThat(catalog.findById("bottom-assinatura")).isPresent();
    }
}
