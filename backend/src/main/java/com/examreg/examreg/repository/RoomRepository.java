package com.examreg.examreg.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.examreg.examreg.models.Room;

public interface RoomRepository extends JpaRepository<Room, Long> {
    List<Room> findByLocationId(Long locationId);
}
