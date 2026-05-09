package com.lojabrug.api.checkout;

public record StripeLineItem(String productName, long unitAmountInCents, int quantity) {
}
