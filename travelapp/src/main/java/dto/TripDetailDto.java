package dto;

import java.time.LocalTime;
import com.fasterxml.jackson.annotation.JsonProperty;
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
    
    @JsonProperty("trip_id")
    private Long tripId;
    
    private String description;
    
    @JsonProperty("start_time")
    private LocalTime startTime;
    
    @JsonProperty("end_time")
    private LocalTime endTime;
    
    @JsonProperty("all_day")
    private Boolean allDay;
    
    private String color;
}