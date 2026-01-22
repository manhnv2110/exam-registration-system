package com.examreg.examreg.mapper;

import org.springframework.stereotype.Component;

import com.examreg.examreg.dto.response.LocationResponse;
import com.examreg.examreg.models.Location;

@Component
public class LocationMapper {
  public LocationResponse buildLocationResponse(Location location) {
    return LocationResponse.builder()
      .id(location.getId())
      .name(location.getName())
      .address(location.getAddress())
      .build();
  }
}
