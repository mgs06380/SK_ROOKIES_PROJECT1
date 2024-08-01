package service;

import dto.UserDto;
import entity.User;
import mapper.UserMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import lombok.extern.slf4j.Slf4j;

import java.time.LocalDateTime;

@Slf4j
@Service
public class UserService implements UserDetailsService {
    
    @Autowired
    private UserMapper userMapper;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public UserDto createUser(UserDto userDto) {
        String encryptedPassword = passwordEncoder.encode(userDto.getPassword());
        User user = User.builder()
                .username(userDto.getUsername())
                .email(userDto.getEmail())
                .password(encryptedPassword)
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
        String encryptedPassword = passwordEncoder.encode(userDto.getPassword());
        User user = User.builder()
                .id(userDto.getId())
                .username(userDto.getUsername())
                .email(userDto.getEmail())
                .password(encryptedPassword)
                .build();
        userMapper.update(user);
        log.info("User updated: {}", user);
    }

    public void deleteUser(Long id) {
        userMapper.delete(id);
        log.info("User deleted: {}", id);
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userMapper.findByUsername(username);
        if (user == null) {
            throw new UsernameNotFoundException("User not found with username: " + username);
        }
        return org.springframework.security.core.userdetails.User
                .withUsername(user.getUsername())
                .password(user.getPassword())
                .roles("USER")
                .build();
    }

    public UserDto getUserByUsername(String username) {
        User user = userMapper.findByUsername(username);
        if (user == null) {
            throw new RuntimeException("User not found");
        }
        return UserDto.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .build();
    }
}
