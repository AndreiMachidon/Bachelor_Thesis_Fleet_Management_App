package com.fleetcore.fleetcorebackend.repository;

import com.fleetcore.fleetcorebackend.entities.User;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    User findUserById(Long id);

    User findUserByDriverDetailsId(Long driverDetailsId);

    @Query("SELECT user.imageData from User user WHERE user.id = :userId")
    Optional<String> getImageDataByUserId(@Param("userId") Long userId);

    @Transactional
    @Modifying
    public void deleteByDriverDetailsId(Long driverDetailsId);

}
