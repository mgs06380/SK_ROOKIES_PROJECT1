package entity;

import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Trip {
    private Long id;
    private User user;
    private String title;
    private LocalDate startDate;
    private LocalDate endDate;
    private LocalDateTime createdAt;
}
