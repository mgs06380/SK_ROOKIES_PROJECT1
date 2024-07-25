package service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import dto.TripDto;
import entity.Trip;
import entity.User;
import lombok.extern.slf4j.Slf4j;
import mapper.TripMapper;
import mapper.UserMapper;

@Slf4j
@Service
public class TripService {
    @Autowired
    private TripMapper tripMapper;

    @Autowired
    private UserMapper userMapper;

    public TripDto createTrip(TripDto tripDto) {
        User user = userMapper.findById(tripDto.getUserId());
        if (user == null) {
            throw new RuntimeException("User not found");
        }
        Trip trip = Trip.builder()
                .user(user)
                .title(tripDto.getTitle())
                .startDate(tripDto.getStartDate())
                .endDate(tripDto.getEndDate())
                .createdAt(LocalDateTime.now())
                .build();
        tripMapper.save(trip);
        tripDto.setId(trip.getId());
        log.info("Trip created: {}", trip);
        return tripDto;
    }

    public List<TripDto> getTrips(Long userId) {
        List<Trip> trips = tripMapper.findByUserId(userId);
        log.info("Trips retrieved for userId {}: {}", userId, trips);
        return trips.stream()
                .map(trip -> TripDto.builder()
                        .id(trip.getId())
                        .userId(trip.getUser().getId())
                        .title(trip.getTitle())
                        .startDate(trip.getStartDate())
                        .endDate(trip.getEndDate())
                        .build())
                .collect(Collectors.toList());
    }

    public TripDto getTrip(Long id) {
        Trip trip = tripMapper.findById(id);
        if (trip == null) {
            throw new RuntimeException("Trip not found");
        }
        return TripDto.builder()
                .id(trip.getId())
                .userId(trip.getUser().getId())
                .title(trip.getTitle())
                .startDate(trip.getStartDate())
                .endDate(trip.getEndDate())
                .build();
    }

    public void updateTrip(TripDto tripDto) {
        User user = userMapper.findById(tripDto.getUserId());
        if (user == null) {
            throw new RuntimeException("User not found");
        }
        Trip trip = Trip.builder()
                .id(tripDto.getId())
                .user(user)
                .title(tripDto.getTitle())
                .startDate(tripDto.getStartDate())
                .endDate(tripDto.getEndDate())
                .build();
        tripMapper.update(trip);
        log.info("Trip updated: {}", trip);
    }

    public void deleteTrip(Long id) {
        tripMapper.delete(id);
        log.info("Trip deleted: {}", id);
    }
}
