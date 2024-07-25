package dto;

import java.time.LocalTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TripDetailDto {
    private Long id;
    private Long tripId;
    private String description;
    private LocalTime startTime;
    private LocalTime endTime;
    private Boolean allDay;
    private String color;
}
