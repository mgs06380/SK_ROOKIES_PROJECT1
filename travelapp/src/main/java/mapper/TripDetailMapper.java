package mapper;

import entity.TripDetail;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface TripDetailMapper {
    @Select("SELECT * FROM trip_details WHERE id = #{id}")
    @Results({
        @Result(property = "trip", column = "trip_id", one = @One(select = "mapper.TripMapper.findById")),
        @Result(property = "description", column = "description"),
        @Result(property = "startTime", column = "start_time"),
        @Result(property = "endTime", column = "end_time"),
        @Result(property = "allDay", column = "all_day"),
        @Result(property = "color", column = "color")
    })
    TripDetail findById(Long id);

    @Select("SELECT * FROM trip_details WHERE trip_id = #{tripId}")
    @Results({
        @Result(property = "trip", column = "trip_id", one = @One(select = "mapper.TripMapper.findById")),
        @Result(property = "description", column = "description"),
        @Result(property = "startTime", column = "start_time"),
        @Result(property = "endTime", column = "end_time"),
        @Result(property = "allDay", column = "all_day"),
        @Result(property = "color", column = "color")
    })
    List<TripDetail> findByTripId(Long tripId);

    @Insert("INSERT INTO trip_details(trip_id, description, start_time, end_time, all_day, color) VALUES(#{trip.id}, #{description}, #{startTime}, #{endTime}, #{allDay}, #{color})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    void save(TripDetail tripDetail);

    @Update("UPDATE trip_details SET description=#{description}, start_time=#{startTime}, end_time=#{endTime}, all_day=#{allDay}, color=#{color} WHERE id=#{id}")
    void update(TripDetail tripDetail);

    @Delete("DELETE FROM trip_details WHERE id=#{id}")
    void delete(Long id);
}
