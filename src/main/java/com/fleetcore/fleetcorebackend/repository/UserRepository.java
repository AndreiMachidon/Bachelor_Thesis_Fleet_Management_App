package com.fleetcore.fleetcorebackend.repository;

import com.fleetcore.fleetcorebackend.entities.User;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    public User findUserById(Long id);

    public User findUserByDriverDetailsId(Long driverDetailsId);

    @Transactional
    @Modifying
    public void deleteByDriverDetailsId(Long driverDetailsId);

}
