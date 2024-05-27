package com.fleetcore.fleetcorebackend.repositories;

import com.fleetcore.fleetcorebackend.entities.User;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    Optional<User> findByDriverDetailsId(Long driverDetailsId);

    @Transactional
    @Modifying
    void deleteByDriverDetailsId(Long driverDetailsId);
}
