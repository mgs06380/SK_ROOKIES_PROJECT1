package service;

import dto.UserDto;
import entity.User;
import mapper.UserMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Slf4j
@Service
public class UserService {
    @Autowired
    private UserMapper userMapper;

    public UserDto createUser(UserDto userDto) {
        User user = User.builder()
                .username(userDto.getUsername())
                .email(userDto.getEmail())
                .password(userDto.getPassword())
                .createdAt(LocalDateTime.now())
                .build();
        userMapper.save(user);
        userDto.setId(user.getId());
        log.info("User created: {}", user);
        return userDto;
    }

    public UserDto getUser(Long id) {
        User user = userMapper.findById(id);
        if (user == null) {
            throw new RuntimeException("User not found");
        }
        log.info("User retrieved: {}", user);
        return UserDto.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .build();
    }

    public void updateUser(UserDto userDto) {
        User user = User.builder()
                .id(userDto.getId())
                .username(userDto.getUsername())
                .email(userDto.getEmail())
                .password(userDto.getPassword())
                .build();
        userMapper.update(user);
        log.info("User updated: {}", user);
    }

    public void deleteUser(Long id) {
        userMapper.delete(id);
        log.info("User deleted: {}", id);
    }

    public String login(String username, String password) {
        User user = userMapper.findByUsername(username);
        if (user != null && user.getPassword().equals(password)) {
            // 인증 성공, 실제로는 JWT 또는 다른 토큰을 생성하여 반환합니다.
            return "dummy-token"; // 여기서는 예시로 "dummy-token"을 반환합니다.
        } else {
            throw new RuntimeException("Invalid credentials");
        }
    }
}
