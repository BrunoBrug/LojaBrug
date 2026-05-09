package com.lojabrug.api.checkout;

import java.util.List;

public record CreateCheckoutRequest(List<CartItemRequest> items) {
}
