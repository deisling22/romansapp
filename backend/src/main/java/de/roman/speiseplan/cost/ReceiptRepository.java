package de.roman.speiseplan.cost;

import java.time.LocalDate;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReceiptRepository extends JpaRepository<Receipt, Long> {
    List<Receipt> findByPurchasedOnBetweenOrderByPurchasedOnDescIdDesc(LocalDate from, LocalDate to);
}
