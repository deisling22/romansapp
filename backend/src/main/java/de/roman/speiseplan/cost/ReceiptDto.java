package de.roman.speiseplan.cost;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

public record ReceiptDto(
        Long id,
        @NotNull LocalDate purchasedOn,
        @NotNull @DecimalMin("0.01") @DecimalMax("100000") Double totalEur,
        @Size(max = 120) String store) {

    static ReceiptDto from(Receipt receipt) {
        return new ReceiptDto(receipt.getId(), receipt.getPurchasedOn(), receipt.getTotalEur(), receipt.getStore());
    }
}
