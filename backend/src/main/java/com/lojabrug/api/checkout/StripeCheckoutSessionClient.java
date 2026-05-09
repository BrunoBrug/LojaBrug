package com.lojabrug.api.checkout;

import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class StripeCheckoutSessionClient implements StripeCheckoutClient {
    private final String secretKey;

    public StripeCheckoutSessionClient(@Value("${lojabrug.stripe.secret-key}") String secretKey) {
        this.secretKey = secretKey;
    }

    @Override
    public String createCheckoutUrl(StripeCheckoutRequest request) {
        if (secretKey == null || secretKey.isBlank()) {
            throw new IllegalStateException("Stripe secret key nao configurada.");
        }

        Stripe.apiKey = secretKey;
        SessionCreateParams.Builder params = SessionCreateParams.builder()
            .setMode(SessionCreateParams.Mode.PAYMENT)
            .setSuccessUrl(request.successUrl())
            .setCancelUrl(request.cancelUrl());

        request.items().forEach((item) -> params.addLineItem(toStripeLineItem(item)));

        try {
            Session session = Session.create(params.build());
            return session.getUrl();
        } catch (StripeException exception) {
            throw new IllegalStateException("Nao foi possivel criar o checkout.", exception);
        }
    }

    private SessionCreateParams.LineItem toStripeLineItem(StripeLineItem item) {
        return SessionCreateParams.LineItem.builder()
            .setQuantity((long) item.quantity())
            .setPriceData(
                SessionCreateParams.LineItem.PriceData.builder()
                    .setCurrency("brl")
                    .setUnitAmount(item.unitAmountInCents())
                    .setProductData(
                        SessionCreateParams.LineItem.PriceData.ProductData.builder()
                            .setName(item.productName())
                            .build()
                    )
                    .build()
            )
            .build();
    }
}
