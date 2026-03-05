package com.example.findora.domain.repository;

import com.example.findora.domain.entity.Claim;
import com.example.findora.domain.enums.ClaimStatus;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ClaimRepository extends JpaRepository<Claim, Long> {

    List<Claim> findByClaimerId(Long claimerId);

    List<Claim> findByReportId(Long reportId);

    List<Claim> findByStatus(ClaimStatus status);

    @Query("SELECT c FROM Claim c WHERE c.claimer.id = :claimerId AND c.status = :status")
    List<Claim> findByClaimerIdAndStatus(@Param("claimerId") Long claimerId, @Param("status") ClaimStatus status);

    @Query("SELECT c FROM Claim c WHERE c.report.id = :reportId AND c.status = :status")
    List<Claim> findByReportIdAndStatus(@Param("reportId") Long reportId, @Param("status") ClaimStatus status);
}
