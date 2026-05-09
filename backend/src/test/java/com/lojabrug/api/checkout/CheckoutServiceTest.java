package com.lojabrug.api.checkout;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import com.lojabrug.api.product.ProductCatalog;
import java.util.List;
import org.junit.jupiter.api.Test;

class CheckoutServiceTest {
    private final CapturingStripeCheckoutClient stripeClient = new CapturingStripeCheckoutClient();
    private final CheckoutService service = new CheckoutService(
        new ProductCatalog(),
        stripeClient,
        "http://localhost:5173"
    );

    @Test
    void rejectsUnknownProductIds() {
        CreateCheckoutRequest request = new CreateCheckoutRequest(
            List.of(new CartItemRequest("produto-inexistente", 1, null))
        );

        assertThatThrownBy(() -> service.createCheckout(request))
            .isInstanceOf(IllegalArgumentException.class)
            .hasMessageContaining("Produto invalido");
    }

    @Test
    void rejectsInvalidQuantities() {
        CreateCheckoutRequest request = new CreateCheckoutRequest(
            List.of(new CartItemRequest("camiseta-essencial", 0, null))
        );

        assertThatThrownBy(() -> service.createCheckout(request))
            .isInstanceOf(IllegalArgumentException.class)
            .hasMessageContaining("Quantidade invalida");
    }

    @Test
    void usesBackendCatalogPriceForLineItems() {
        CreateCheckoutRequest request = new CreateCheckoutRequest(
            List.of(new CartItemRequest("camiseta-essencial", 2, "M"))
        );

        CreateCheckoutResponse response = service.createCheckout(request);

        assertThat(response.checkoutUrl()).isEqualTo("https://checkout.stripe.test/session");
        assertThat(stripeClient.lastRequest().items()).hasSize(1);
        assertThat(stripeClient.lastRequest().items().getFirst().productName()).isEqualTo(
            "Camiseta Essencial"
        );
        assertThat(stripeClient.lastRequest().items().getFirst().unitAmountInCents()).isEqualTo(8900);
        assertThat(stripeClient.lastRequest().items().getFirst().quantity()).isEqualTo(2);
    }

    private static class CapturingStripeCheckoutClient implements StripeCheckoutClient {
        private StripeCheckoutRequest lastRequest;

        @Override
        public String createCheckoutUrl(StripeCheckoutRequest request) {
            this.lastRequest = request;
            return "https://checkout.stripe.test/session";
        }

        StripeCheckoutRequest lastRequest() {
            return lastRequest;
        }
    }
}
