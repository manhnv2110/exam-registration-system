package com.examreg.examreg.service;
import java.util.List;
import com.examreg.examreg.dto.response.LocationResponse;


public interface ILocationService {
    List<LocationResponse> getAllLocations();
    Integer getTotalCapacityByLocationAndSubject(Long locationId, Long subjectId);
}
