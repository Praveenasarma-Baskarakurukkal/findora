package com.example.findora.item;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ItemRepository extends JpaRepository<Item, Long> {

    @Query("""
            SELECT i FROM Item i
            WHERE
            (:keyword IS NULL OR LOWER(i.itemName) LIKE LOWER(CONCAT('%', :keyword, '%'))
                OR LOWER(COALESCE(i.description, '')) LIKE LOWER(CONCAT('%', :keyword, '%')))
            AND
            (:normalizedCategory IS NULL OR
             LOWER(function('replace', function('replace', i.category, ' ', ''), '/', '')) = :normalizedCategory)
            """)
    List<Item> searchItems(@Param("keyword") String keyword,
                           @Param("normalizedCategory") String normalizedCategory);
}
