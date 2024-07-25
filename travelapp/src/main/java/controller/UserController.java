package controller;

import dto.UserDto;
import service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
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

    @PostMapping("/login")
    public String login(@RequestParam("username") String username, @RequestParam("password") String password) {
        log.info("Login request received for username: {}", username);
        return userService.login(username, password);
    }
}
