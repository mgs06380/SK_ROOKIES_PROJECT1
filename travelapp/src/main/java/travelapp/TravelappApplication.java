package travelapp;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@MapperScan("mapper") // 매퍼 인터페이스가 있는 패키지 경로로 수정
@ComponentScan(basePackages = {"controller", "service", "dto", "configuration", "mapper"}) // 필요한 패키지 경로로 수정
public class TravelappApplication {

    public static void main(String[] args) {
        SpringApplication.run(TravelappApplication.class, args);
    }
}
