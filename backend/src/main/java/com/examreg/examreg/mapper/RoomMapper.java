package com.examreg.examreg.mapper;

import org.springframework.stereotype.Component;

import com.examreg.examreg.dto.response.LocationResponse;
import com.examreg.examreg.dto.response.RoomResponse;
import com.examreg.examreg.models.Location;
import com.examreg.examreg.models.Room;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class RoomMapper {

  private final LocationMapper locationMapper;

  public RoomResponse buildRoomResponse(Room room) {
    Location location = room.getLocation();
    LocationResponse locationResponse = locationMapper.buildLocationResponse(location);
    return RoomResponse.builder()
      .id(room.getId())
      .name(room.getName())
      .location(locationResponse)
      .build();
  }
}
