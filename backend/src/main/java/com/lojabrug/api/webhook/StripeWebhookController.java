package com.lojabrug.api.webhook;

import com.lojabrug.api.order.PaymentEventLog;
import com.stripe.exception.SignatureVerificationException;
import com.stripe.model.Event;
import com.stripe.net.Webhook;
import java.time.Instant;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/webhooks/stripe")
public class StripeWebhookController {
    private final String webhookSecret;
    private final List<PaymentEventLog> receivedEvents = new CopyOnWriteArrayList<>();

    public StripeWebhookController(@Value("${lojabrug.stripe.webhook-secret}") String webhookSecret) {
        this.webhookSecret = webhookSecret;
    }

    @PostMapping
    public ResponseEntity<Void> handleStripeWebhook(
        @RequestBody String payload,
        @RequestHeader(value = "Stripe-Signature", required = false) String signature
    ) {
        if (signature == null || signature.isBlank()) {
            return ResponseEntity.badRequest().build();
        }

        try {
            Event event = Webhook.constructEvent(payload, signature, webhookSecret);

            if ("checkout.session.completed".equals(event.getType())) {
                receivedEvents.add(new PaymentEventLog(event.getId(), event.getType(), Instant.now()));
            }

            return ResponseEntity.ok().build();
        } catch (SignatureVerificationException exception) {
            return ResponseEntity.badRequest().build();
        }
    }
}
