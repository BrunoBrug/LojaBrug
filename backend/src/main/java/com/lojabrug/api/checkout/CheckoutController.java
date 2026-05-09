package com.lojabrug.api.checkout;

import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class CheckoutController {
    private final CheckoutService checkoutService;

    public CheckoutController(CheckoutService checkoutService) {
        this.checkoutService = checkoutService;
    }

    @PostMapping("/api/checkout")
    public CreateCheckoutResponse createCheckout(@RequestBody @Valid CreateCheckoutRequest request) {
        return checkoutService.createCheckout(request);
    }
}
