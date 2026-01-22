package com.examreg.examreg.controllers;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.examreg.examreg.dto.response.ApiResponse;
import com.examreg.examreg.dto.response.LocationResponse;
import com.examreg.examreg.dto.response.RoomResponse;
import com.examreg.examreg.service.impl.LocationService;
import com.examreg.examreg.service.impl.RoomService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("${api.prefix}/locations")
public class RoomLocationController {
    private final LocationService locationService;
    private final RoomService roomService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<LocationResponse>>> getAllLocations() {
        List<LocationResponse> locations = locationService.getAllLocations();

        return ResponseEntity.ok(
            ApiResponse.success("successfully", locations)
        );
    }

    @GetMapping("/{locationId}/rooms")
    public ResponseEntity<ApiResponse<List<RoomResponse>>> getRoomsByLocationId(@PathVariable Long locationId) {
        List<RoomResponse> rooms = roomService.getRoomsByLocationId(locationId);

        return ResponseEntity.ok(
            ApiResponse.success("successfully", rooms)
        );
    }

    @GetMapping("/{locationId}/subject/{subjectId}/capacity")
    public ResponseEntity<ApiResponse<Integer>> getTotalCapacity(
        @PathVariable Long locationId,
        @PathVariable Long subjectId
    ) {
        Integer totalCapacity = locationService.getTotalCapacityByLocationAndSubject(locationId, subjectId);
        return ResponseEntity.ok(
            ApiResponse.success("Get total capacity successfully", totalCapacity)
        );
    }
}
