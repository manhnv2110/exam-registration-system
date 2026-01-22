package com.examreg.examreg.service.impl;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.examreg.examreg.dto.response.LocationResponse;
import com.examreg.examreg.mapper.LocationMapper;
import com.examreg.examreg.repository.LocationRepository;
import lombok.RequiredArgsConstructor;
import com.examreg.examreg.service.ILocationService;

@Service
@RequiredArgsConstructor
public class LocationService implements ILocationService {
    private final LocationRepository locationRepository;
    private final LocationMapper locationMapper;

    @Override
    public List<LocationResponse> getAllLocations() {
        return locationRepository.findAll()
        .stream()
        .map(locationMapper::buildLocationResponse)
        .collect(Collectors.toList());
    }

    @Override
    public Integer getTotalCapacityByLocationAndSubject(Long locationId, Long subjectId) {
    return locationRepository.getTotalCapacityByLocationAndSubject(locationId, subjectId);
  }
}
