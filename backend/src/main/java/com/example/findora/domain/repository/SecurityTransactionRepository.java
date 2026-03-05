package com.example.findora.domain.repository;

import com.example.findora.domain.entity.SecurityTransaction;
import com.example.findora.domain.enums.TransactionType;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface SecurityTransactionRepository extends JpaRepository<SecurityTransaction, Long> {

    List<SecurityTransaction> findByItemId(Long itemId);

    List<SecurityTransaction> findBySecurityOfficerId(Long securityOfficerId);

    List<SecurityTransaction> findByTransactionType(TransactionType transactionType);

    @Query("SELECT st FROM SecurityTransaction st WHERE st.securityOfficer.id = :securityOfficerId ORDER BY st.createdAt DESC")
    List<SecurityTransaction> findTransactionsBySecurityOfficer(@Param("securityOfficerId") Long securityOfficerId);

    @Query("SELECT st FROM SecurityTransaction st WHERE st.item.id = :itemId ORDER BY st.createdAt DESC")
    List<SecurityTransaction> findItemTransactionHistory(@Param("itemId") Long itemId);
}
