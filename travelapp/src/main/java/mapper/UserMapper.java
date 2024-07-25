package mapper;

import entity.User;
import org.apache.ibatis.annotations.*;

@Mapper
public interface UserMapper {
    @Select("SELECT * FROM users WHERE id = #{id}")
    User findById(Long id);

    @Insert("INSERT INTO users(username, email, password, created_at) VALUES(#{username}, #{email}, #{password}, #{createdAt})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    void save(User user);

    @Update("UPDATE users SET username=#{username}, email=#{email}, password=#{password} WHERE id=#{id}")
    void update(User user);

    @Delete("DELETE FROM users WHERE id=#{id}")
    void delete(Long id);

    @Select("SELECT * FROM users WHERE username = #{username}")
    User findByUsername(String username);
}
