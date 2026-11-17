package de.roman.speiseplan.shopping;

import java.util.List;

/** Items the client had in the cart; without ids every checked item is booked. */
public record CheckoutRequest(List<Long> itemIds) {
}
