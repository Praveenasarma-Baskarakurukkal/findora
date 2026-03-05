package com.example.findora.domain.repository;

import com.example.findora.domain.entity.Report;
import com.example.findora.domain.enums.ReportType;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ReportRepository extends JpaRepository<Report, Long> {

    List<Report> findByReportType(ReportType reportType);

    List<Report> findByReportedById(Long userId);

    @Query("SELECT r FROM Report r WHERE r.reportedBy.id = :userId AND r.reportType = :reportType")
    List<Report> findByUserIdAndReportType(@Param("userId") Long userId, @Param("reportType") ReportType reportType);

    @Query("SELECT r FROM Report r WHERE r.createdAt BETWEEN :startDate AND :endDate")
    List<Report> findByDateRange(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    @Query("SELECT r FROM Report r WHERE r.matchScore IS NOT NULL ORDER BY r.matchScore DESC")
    List<Report> findMatchedReports();
}
