package com.example.findora.domain.repository;

import com.example.findora.domain.entity.Item;
import com.example.findora.domain.enums.ItemStatus;
import java.time.LocalDate;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface ItemRepository extends JpaRepository<Item, Long> {

    List<Item> findByStatus(ItemStatus status);

    List<Item> findByLocation(String location);

    List<Item> findByDateBetween(LocalDate startDate, LocalDate endDate);

    List<Item> findByReportId(Long reportId);

    @Query("SELECT i FROM Item i WHERE i.status = 'PENDING' ORDER BY i.createdAt DESC")
    List<Item> findPendingItems();
}
