package dto;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TripDto {
    private Long id;
    private Long userId;
    private String title;
    private LocalDate startDate;
    private LocalDate endDate;
}