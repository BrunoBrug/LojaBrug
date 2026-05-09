package com.lojabrug.api.order;

import java.time.Instant;

public record PaymentEventLog(String stripeEventId, String type, Instant receivedAt) {
}
