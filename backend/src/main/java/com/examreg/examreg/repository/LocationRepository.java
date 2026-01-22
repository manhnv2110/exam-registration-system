package com.examreg.examreg.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.examreg.examreg.models.Location;

public interface LocationRepository extends JpaRepository<Location, Long> {
    @Query("""
        SELECT COALESCE(SUM(es.capacity), 0)
        FROM ExamSession es
        JOIN es.room r
        WHERE r.location.id = :locationId
        AND es.subject.id = :subjectId
    """)
    Integer getTotalCapacityByLocationAndSubject(
            @Param("locationId") Long locationId,
            @Param("subjectId") Long subjectId
    );
}
