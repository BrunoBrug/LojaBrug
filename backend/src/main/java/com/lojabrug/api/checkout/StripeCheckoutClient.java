package com.lojabrug.api.checkout;

public interface StripeCheckoutClient {
    String createCheckoutUrl(StripeCheckoutRequest request);
}
