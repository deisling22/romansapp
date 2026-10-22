package de.roman.speiseplan.cost;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.temporal.TemporalAdjusters;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class ReceiptService {
    private final ReceiptRepository receiptRepository;

    public ReceiptService(ReceiptRepository receiptRepository) {
        this.receiptRepository = receiptRepository;
    }

    @Transactional(readOnly = true)
    public List<ReceiptDto> list(LocalDate from, LocalDate to) {
        if (from.isAfter(to)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Zeitraum ist ungültig.");
        }
        return receiptRepository.findByPurchasedOnBetweenOrderByPurchasedOnDescIdDesc(from, to).stream()
                .map(ReceiptDto::from)
                .toList();
    }

    @Transactional
    public ReceiptDto create(ReceiptDto request, String email) {
        String store = request.store() == null || request.store().isBlank() ? null : request.store().trim();
        double total = Math.round(request.totalEur() * 100) / 100.0;
        return ReceiptDto.from(receiptRepository.save(new Receipt(request.purchasedOn(), total, store, email)));
    }

    @Transactional
    public void delete(Long id) {
        Receipt receipt = receiptRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Beleg wurde nicht gefunden."));
        receiptRepository.delete(receipt);
    }

    @Transactional(readOnly = true)
    public double sum(LocalDate from, LocalDate to) {
        return receiptRepository.findByPurchasedOnBetweenOrderByPurchasedOnDescIdDesc(from, to).stream()
                .mapToDouble(Receipt::getTotalEur)
                .sum();
    }

    public static LocalDate startOfWeek(LocalDate day) {
        return day.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));
    }
}
