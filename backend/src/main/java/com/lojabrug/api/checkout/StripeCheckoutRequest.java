package com.lojabrug.api.checkout;

import java.util.List;

public record StripeCheckoutRequest(
    List<StripeLineItem> items,
    String successUrl,
    String cancelUrl
) {
}
