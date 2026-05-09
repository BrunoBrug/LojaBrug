package com.lojabrug.api.webhook;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest(properties = "lojabrug.stripe.webhook-secret=whsec_test")
@AutoConfigureMockMvc
class StripeWebhookControllerTest {
    private static final String PAYLOAD = """
        {
          "id": "evt_test_checkout_completed",
          "object": "event",
          "type": "checkout.session.completed",
          "data": {
            "object": {
              "id": "cs_test_123",
              "object": "checkout.session"
            }
          }
        }
        """;

    @Autowired
    private MockMvc mockMvc;

    @Test
    void rejectsMissingSignature() throws Exception {
        mockMvc
            .perform(
                post("/api/webhooks/stripe").contentType(MediaType.APPLICATION_JSON).content(PAYLOAD)
            )
            .andExpect(status().isBadRequest());
    }

    @Test
    void rejectsInvalidSignature() throws Exception {
        mockMvc
            .perform(
                post("/api/webhooks/stripe")
                    .contentType(MediaType.APPLICATION_JSON)
                    .header("Stripe-Signature", "t=123,v1=invalid")
                    .content(PAYLOAD)
            )
            .andExpect(status().isBadRequest());
    }

    @Test
    void acceptsCheckoutCompletedWithValidSignature() throws Exception {
        mockMvc
            .perform(
                post("/api/webhooks/stripe")
                    .contentType(MediaType.APPLICATION_JSON)
                    .header("Stripe-Signature", signatureHeader(PAYLOAD, "whsec_test"))
                    .content(PAYLOAD)
            )
            .andExpect(status().isOk());
    }

    private static String signatureHeader(String payload, String secret) throws Exception {
        long timestamp = System.currentTimeMillis() / 1000;
        String signedPayload = timestamp + "." + payload;
        Mac mac = Mac.getInstance("HmacSHA256");
        mac.init(new SecretKeySpec(secret.getBytes(), "HmacSHA256"));
        byte[] digest = mac.doFinal(signedPayload.getBytes());

        return "t=" + timestamp + ",v1=" + toHex(digest);
    }

    private static String toHex(byte[] bytes) {
        StringBuilder hex = new StringBuilder(bytes.length * 2);

        for (byte value : bytes) {
            hex.append(String.format("%02x", value));
        }

        return hex.toString();
    }
}
