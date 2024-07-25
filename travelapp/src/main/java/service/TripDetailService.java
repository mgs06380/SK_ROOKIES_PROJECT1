
package service;

import dto.TripDetailDto;
import entity.Trip;
import entity.TripDetail;
import mapper.TripDetailMapper;
import mapper.TripMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
public class TripDetailService {
    @Autowired
    private TripDetailMapper tripDetailMapper;

    @Autowired
    private TripMapper tripMapper;

    public TripDetailDto createTripDetail(TripDetailDto tripDetailDto) {
        Trip trip = tripMapper.findById(tripDetailDto.getTripId());
        if (trip == null) {
            throw new RuntimeException("Trip not found");
        }
        TripDetail tripDetail = TripDetail.builder()
                .trip(trip)
                .description(tripDetailDto.getDescription())
                .startTime(tripDetailDto.getStartTime())
                .endTime(tripDetailDto.getEndTime())
                .allDay(tripDetailDto.getAllDay())
                .color(tripDetailDto.getColor())
                .build();
        tripDetailMapper.save(tripDetail);
        tripDetailDto.setId(tripDetail.getId());
        log.info("Trip detail created: {}", tripDetail);
        return tripDetailDto;
    }

    public TripDetailDto getTripDetail(Long id) {
        TripDetail tripDetail = tripDetailMapper.findById(id);
        if (tripDetail == null) {
            throw new RuntimeException("TripDetail not found");
        }
        log.info("Trip detail retrieved: {}", tripDetail);
        return TripDetailDto.builder()
                .id(tripDetail.getId())
                .tripId(tripDetail.getTrip() != null ? tripDetail.getTrip().getId() : null)
                .description(tripDetail.getDescription())
                .startTime(tripDetail.getStartTime())
                .endTime(tripDetail.getEndTime())
                .allDay(tripDetail.getAllDay())
                .color(tripDetail.getColor())
                .build();
    }

    public List<TripDetailDto> getTripDetails(Long tripId) {
        Trip trip = tripMapper.findById(tripId);
        if (trip == null) {
            log.info("Trip not found for tripId: {}", tripId);
            throw new RuntimeException("There is no trip plan");
        }
        
        List<TripDetail> tripDetails = tripDetailMapper.findByTripId(tripId);
        if (tripDetails.isEmpty()) {
            log.info("No trip details found for tripId: {}", tripId);
            throw new RuntimeException("Trip detail not found");
        }
        
        log.info("Trip details retrieved for tripId {}: {}", tripId, tripDetails);
        return tripDetails.stream().map(tripDetail -> TripDetailDto.builder()
                .id(tripDetail.getId())
                .tripId(tripDetail.getTrip() != null ? tripDetail.getTrip().getId() : null)
                .description(tripDetail.getDescription())
                .startTime(tripDetail.getStartTime())
                .endTime(tripDetail.getEndTime())
                .allDay(tripDetail.getAllDay())
                .color(tripDetail.getColor())
                .build()).collect(Collectors.toList());
    }

    public void updateTripDetail(TripDetailDto tripDetailDto) {
        Trip trip = tripMapper.findById(tripDetailDto.getTripId());
        if (trip == null) {
            throw new RuntimeException("Trip not found");
        }
        TripDetail tripDetail = TripDetail.builder()
                .id(tripDetailDto.getId())
                .trip(trip)
                .description(tripDetailDto.getDescription())
                .startTime(tripDetailDto.getStartTime())
                .endTime(tripDetailDto.getEndTime())
                .allDay(tripDetailDto.getAllDay())
                .color(tripDetailDto.getColor())
                .build();
        tripDetailMapper.update(tripDetail);
        log.info("Trip detail updated: {}", tripDetail);
    }

    public void deleteTripDetail(Long id) {
        TripDetail tripDetail = tripDetailMapper.findById(id);
        if (tripDetail == null) {
            throw new RuntimeException("TripDetail not found");
        }
        tripDetailMapper.delete(id);
        log.info("Trip detail deleted: {}", id);
    }
}