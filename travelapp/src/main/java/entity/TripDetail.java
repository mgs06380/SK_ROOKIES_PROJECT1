package entity;

import lombok.*;

import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TripDetail {
    private Long id;
    private Trip trip;
    private String description;
    private LocalTime startTime;
    private LocalTime endTime;
    private Boolean allDay;
    private String color;
}
