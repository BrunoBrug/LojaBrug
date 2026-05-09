package com.lojabrug.api.checkout;

public record CartItemRequest(String productId, int quantity, String option) {
}
