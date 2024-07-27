package mapper;

import entity.Trip;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface TripMapper {
    @Select("SELECT * FROM trips WHERE id = #{id}")
    @Results({
        @Result(property = "user", column = "user_id", one = @One(select = "mapper.UserMapper.findById")),
        @Result(property = "startDate", column = "start_date"),
        @Result(property = "endDate", column = "end_date")
    })
    Trip findById(Long id);

    @Select("SELECT * FROM trips WHERE user_id = #{userId}")
    @Results({
        @Result(property = "user", column = "user_id", one = @One(select = "mapper.UserMapper.findById")),
        @Result(property = "startDate", column = "start_date"),
        @Result(property = "endDate", column = "end_date")
    })
    List<Trip> findByUserId(Long userId);

    @Insert("INSERT INTO trips(user_id, title, start_date, end_date, created_at) VALUES(#{user.id}, #{title}, #{startDate}, #{endDate}, #{createdAt})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    void save(Trip trip);

    @Update("UPDATE trips SET user_id=#{user.id}, title=#{title}, start_date=#{startDate}, end_date=#{endDate} WHERE id=#{id}")
    void update(Trip trip);

    @Delete("DELETE FROM trips WHERE id=#{id}")
    void delete(Long id);
}