package controller;

import dto.UserDto;
import service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/users")
public class UserController {
    
    @Autowired
    private UserService userService;

    @PostMapping("/signup")
    public UserDto signup(@RequestBody UserDto userDto) {
        log.info("Signup request received: {}", userDto);
        return userService.createUser(userDto);
    }

    @GetMapping("/{id}")
    public UserDto getUser(@PathVariable("id") Long id) {
        log.info("Get user request received for id: {}", id);
        return userService.getUser(id);
    }

    @PutMapping("/{id}")
    public void updateUser(@PathVariable("id") Long id, @RequestBody UserDto userDto) {
        userDto.setId(id);
        log.info("Update user request received: {}", userDto);
        userService.updateUser(userDto);
    }

    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable("id") Long id) {
        log.info("Delete user request received for id: {}", id);
        userService.deleteUser(id);
    }

    // 새로운 메서드: 현재 사용자 ID로 정보 가져오기
    @GetMapping("/me")
    public UserDto getCurrentUser(@AuthenticationPrincipal UserDetails userDetails) {
        // 현재 사용자의 ID를 가져오는 로직 추가
        UserDto currentUser = userService.getUserByUsername(userDetails.getUsername());
        Long currentUserId = currentUser.getId(); // 현재 사용자 ID
        log.info("Get current user request received for id: {}", currentUserId);
        return userService.getUser(currentUserId); // ID로 사용자 정보 가져오기
    }
}
