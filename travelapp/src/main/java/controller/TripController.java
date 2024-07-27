package controller;

import dto.TripDto;
import service.TripService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/trips")
public class TripController {
    @Autowired
    private TripService tripService;

    @PostMapping
    public TripDto createTrip(@RequestBody TripDto tripDto) {
        log.info("Create trip request received: {}", tripDto);
        log.info("Start Date: {}", tripDto.getStartDate());
        log.info("End Date: {}", tripDto.getEndDate());
        
        if (tripDto.getStartDate() == null || tripDto.getEndDate() == null) {
            throw new IllegalArgumentException("Start date and end date cannot be null");
        }

        return tripService.createTrip(tripDto);
    }

    @GetMapping
    public List<TripDto> getTrips() {
        log.info("Get trips request received");
        return tripService.getTrips();
    }

    @GetMapping("/{id}")
    public TripDto getTrip(@PathVariable("id") Long id) {
        log.info("Get trip request received for id: {}", id);
        return tripService.getTrip(id);
    }

    @PutMapping("/{id}")
    public void updateTrip(@PathVariable("id") Long id, @RequestBody TripDto tripDto) {
        tripDto.setId(id);
        log.info("Update trip request received: {}", tripDto);
        tripService.updateTrip(tripDto);
    }

    @DeleteMapping("/{id}")
    public void deleteTrip(@PathVariable("id") Long id) {
        log.info("Delete trip request received for id: {}", id);
        tripService.deleteTrip(id);
    }
}
