package com.examreg.examreg.service;
import java.util.List;
import com.examreg.examreg.dto.response.RoomResponse;

public interface IRoomService {
    List<RoomResponse> getRoomsByLocationId(Long locationId);
} 