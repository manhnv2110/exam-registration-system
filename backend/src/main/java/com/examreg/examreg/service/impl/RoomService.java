package com.examreg.examreg.service.impl;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.examreg.examreg.dto.response.RoomResponse;
import com.examreg.examreg.exceptions.ResourceNotFoundException;
import com.examreg.examreg.mapper.RoomMapper;
import com.examreg.examreg.repository.LocationRepository;
import com.examreg.examreg.repository.RoomRepository;
import lombok.RequiredArgsConstructor;
import com.examreg.examreg.service.IRoomService;
import com.examreg.examreg.models.Location;

@Service
@RequiredArgsConstructor
public class RoomService implements IRoomService {
    private final RoomRepository roomRepository;
    private final LocationRepository locationRepository;
    private final RoomMapper roomMapper;

    @Override
    public List<RoomResponse> getRoomsByLocationId(Long locationId) {
        Location location = locationRepository.findById(locationId).orElseThrow(() -> new ResourceNotFoundException("Location not found with id: " + locationId));
        return roomRepository.findByLocationId(locationId)
            .stream()
            .map(roomMapper::buildRoomResponse)
            .collect(Collectors.toList());
    }
}