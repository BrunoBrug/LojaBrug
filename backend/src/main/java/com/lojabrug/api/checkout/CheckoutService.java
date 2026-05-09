package com.lojabrug.api.checkout;

import com.lojabrug.api.product.Product;
import com.lojabrug.api.product.ProductCatalog;
import java.util.List;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class CheckoutService {
    private final ProductCatalog catalog;
    private final StripeCheckoutClient stripeCheckoutClient;
    private final String frontendUrl;

    public CheckoutService(
        ProductCatalog catalog,
        StripeCheckoutClient stripeCheckoutClient,
        @Value("${lojabrug.frontend-url}") String frontendUrl
    ) {
        this.catalog = catalog;
        this.stripeCheckoutClient = stripeCheckoutClient;
        this.frontendUrl = frontendUrl;
    }

    public CreateCheckoutResponse createCheckout(CreateCheckoutRequest request) {
        if (request.items() == null || request.items().isEmpty()) {
            throw new IllegalArgumentException("Carrinho vazio.");
        }

        List<StripeLineItem> lineItems = request.items().stream().map(this::toLineItem).toList();
        String checkoutUrl = stripeCheckoutClient.createCheckoutUrl(
            new StripeCheckoutRequest(lineItems, frontendUrl + "/success", frontendUrl + "/cancel")
        );

        return new CreateCheckoutResponse(checkoutUrl);
    }

    private StripeLineItem toLineItem(CartItemRequest item) {
        if (item.quantity() < 1) {
            throw new IllegalArgumentException("Quantidade invalida.");
        }

        Product product = catalog
            .findById(item.productId())
            .orElseThrow(() -> new IllegalArgumentException("Produto invalido."));

        return new StripeLineItem(product.name(), product.priceInCents(), item.quantity());
    }
}
