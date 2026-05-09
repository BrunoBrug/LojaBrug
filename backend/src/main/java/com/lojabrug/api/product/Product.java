package com.lojabrug.api.product;

import java.util.List;

public record Product(
    String id,
    String name,
    String category,
    String description,
    long priceInCents,
    String imageUrl,
    List<String> options
) {
}
