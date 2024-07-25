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
        return tripService.createTrip(tripDto);
    }

    @GetMapping
    public List<TripDto> getTrips(@RequestParam("userId") Long userId) {
        log.info("Get trips request received for userId: {}", userId);
        return tripService.getTrips(userId);
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
