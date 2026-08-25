package com.bloodsystem.controller;

import com.bloodsystem.dto.*;
import com.bloodsystem.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.security.Principal;
import java.util.List;


@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/users")
public class UserController {


    @Autowired
    private UserService userService;



    // Permission user management
    private void requireAdmin(Principal principal) {

        if (principal == null || !userService.isAdministrator(principal.getName())) {

            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Administrator access required"
            );

        }

    }



    @GetMapping("/me")
    public UserResponse getCurrentUser(Principal principal) {

        if (principal == null) {

            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Not authenticated"
            );

        }

        return userService.getUserByUsername(principal.getName());

    }




    @GetMapping
    public List<UserResponse> getAllUsers(Principal principal) {

        requireAdmin(principal);

        return userService.getAllUsers();

    }




    @GetMapping("/{id}")
    public UserResponse getUserById(
            @PathVariable Integer id,
            Principal principal) {


        requireAdmin(principal);

        return userService.getUserById(id);

    }




    @PostMapping
    public UserResponse createUser(
            @Valid @RequestBody UserCreateRequest request,
            Principal principal) {


        requireAdmin(principal);

        return userService.createUser(request);

    }




    @PutMapping("/{id}")
    public UserResponse updateUser(
            @PathVariable Integer id,
            @Valid @RequestBody UserUpdateRequest request,
            Principal principal) {


        requireAdmin(principal);

        return userService.updateUser(id, request);

    }




    @PostMapping("/{id}/reset-password")
    public MessageResponse resetPassword(
            @PathVariable Integer id,
            @Valid @RequestBody ResetPasswordRequest request,
            Principal principal) {


        requireAdmin(principal);


        userService.resetUserPassword(
                id,
                request.getNewPassword()
        );


        return new MessageResponse(
                "Password reset successfully"
        );

    }




    @DeleteMapping("/{id}")
    public MessageResponse deleteUser(
            @PathVariable Integer id,
            Principal principal) {


        requireAdmin(principal);


        userService.deleteUser(
                id,
                principal.getName()
        );


        return new MessageResponse(
                "User deleted successfully"
        );

    }




    @PostMapping("/change-password")
    public MessageResponse changeOwnPassword(
            @Valid @RequestBody PasswordChangeRequest request,
            Principal principal) {


        if (principal == null) {

            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Not authenticated"
            );

        }


        userService.changeOwnPassword(
                principal.getName(),
                request
        );


        return new MessageResponse(
                "Password updated successfully"
        );

    }

}