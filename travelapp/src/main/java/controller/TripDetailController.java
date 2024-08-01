package controller;

import dto.TripDetailDto;
import service.TripDetailService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/tripDetails")
public class TripDetailController {
    @Autowired
    private TripDetailService tripDetailService;

    @PostMapping
    public ResponseEntity<?> createTripDetail(@RequestBody TripDetailDto tripDetailDto) {
        try {
            log.info("Create trip detail request received: {}", tripDetailDto);
            if (tripDetailDto.getTripId() == null) {
                return ResponseEntity.badRequest().body("Trip ID is required");
            }
            TripDetailDto createdDetail = tripDetailService.createTripDetail(tripDetailDto);
            return ResponseEntity.ok(createdDetail);
        } catch (RuntimeException e) {
            log.error("Error: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getTripDetail(@PathVariable("id") Long id) {
        try {
            log.info("Get trip detail request received for id: {}", id);
            return ResponseEntity.ok(tripDetailService.getTripDetail(id));
        } catch (RuntimeException e) {
            log.error("Error: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<?> getTripDetails(@RequestParam("tripId") Long tripId) {
        try {
            log.info("Get trip details request received for tripId: {}", tripId);
            return ResponseEntity.ok(tripDetailService.getTripDetails(tripId));
        } catch (RuntimeException e) {
            log.error("Error: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateTripDetail(@PathVariable("id") Long id, @RequestBody TripDetailDto tripDetailDto) {
        try {
            tripDetailDto.setId(id);
            log.info("Update trip detail request received: {}", tripDetailDto);
            tripDetailService.updateTripDetail(tripDetailDto);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            log.error("Error: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTripDetail(@PathVariable("id") Long id) {
        try {
            log.info("Delete trip detail request received for id: {}", id);
            tripDetailService.deleteTripDetail(id);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            log.error("Error: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
}
