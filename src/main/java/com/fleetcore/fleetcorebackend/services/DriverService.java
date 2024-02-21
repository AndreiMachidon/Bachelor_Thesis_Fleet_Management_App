package com.fleetcore.fleetcorebackend.services;

import com.fleetcore.fleetcorebackend.dto.DriverDto;
import com.fleetcore.fleetcorebackend.email.EmailDetails;
import com.fleetcore.fleetcorebackend.email.EmailServiceImpl;
import com.fleetcore.fleetcorebackend.entities.DriverDetails;
import com.fleetcore.fleetcorebackend.entities.User;
import com.fleetcore.fleetcorebackend.repository.DriverDetailsRepository;
import com.fleetcore.fleetcorebackend.repository.UserRepository;
import com.fleetcore.fleetcorebackend.util.DriverPasswordGenerator;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@RequiredArgsConstructor
@Service
public class DriverService {

    private final DriverDetailsRepository driverDetailsRepository;

    private final UserRepository userRepository;

    private final EmailServiceImpl emailService;

    private final PasswordEncoder passwordEncoder;


    public List<DriverDto> getDriversByAdminId(Long adminId){
        List<DriverDetails> driverDetails  = driverDetailsRepository.getDriverDetailsByAdminId(adminId);
        List<DriverDto> drivers = new ArrayList<>();

        for(DriverDetails details: driverDetails){
            User userDetails = userRepository.findUserByDriverDetailsId(details.getId());
            DriverDto driverDto = new DriverDto();
            driverDto.setId(details.getId());
            driverDto.setOrganisationName(userDetails.getOrganisationName());
            driverDto.setFirstName(userDetails.getFirstName());
            driverDto.setLastName(userDetails.getLastName());
            driverDto.setPhoneNumber(userDetails.getPhoneNumber());
            driverDto.setEmail(userDetails.getEmail());
            driverDto.setRole(userDetails.getRole());
            driverDto.setImageData(userDetails.getImageData());
            driverDto.setRatePerKilometer(details.getRatePerKilometer());
            driverDto.setLicenseExpiryDate(details.getLicenseExpiryDate());
            driverDto.setTotalKilometersDriven(details.getTotalKilometersDriven());
            driverDto.setYearsOfExperience(details.getYearsOfExperience());
            drivers.add(driverDto);
        }
        return drivers;
    }

    public DriverDto createDriverDtoForLogin(User user){
        DriverDetails driverDetails = driverDetailsRepository.getDriverDetailsById(user.getDriverDetailsId());

        DriverDto driverDto = DriverDto.builder()
                .id(driverDetails.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .organisationName(user.getOrganisationName())
                .phoneNumber(user.getPhoneNumber())
                .role(user.getRole())
                .ratePerKilometer(driverDetails.getRatePerKilometer())
                .licenseExpiryDate(driverDetails.getLicenseExpiryDate())
                .yearsOfExperience(driverDetails.getYearsOfExperience())
                .totalKilometersDriven(driverDetails.getTotalKilometersDriven())
                .build();

        driverDto.setImageData(user.getImageData());

        return driverDto;
    }

    public DriverDto registerDriver(Long adminId, DriverDto driverDto){

        DriverDetails driverDetails = DriverDetails.builder()
                .adminId(adminId)
                .ratePerKilometer(driverDto.getRatePerKilometer())
                .licenseExpiryDate(driverDto.getLicenseExpiryDate())
                .yearsOfExperience(driverDto.getYearsOfExperience())
                .build();

        driverDetails  = driverDetailsRepository.save(driverDetails);

        User user = User.builder()
                .firstName(driverDto.getFirstName())
                .lastName(driverDto.getLastName())
                .email(driverDto.getEmail())
                .phoneNumber(driverDto.getPhoneNumber())
                .organisationName(driverDto.getOrganisationName())
                .role(driverDto.getRole())
                .driverDetailsId(driverDetails.getId())
                .build();

        user.setImageData(driverDto.getImageData());
        String driverPassword = DriverPasswordGenerator.generatePasswordForDriver();
        user.setPassword(passwordEncoder.encode(driverPassword));

        user = userRepository.save(user);

        EmailDetails emailDetails = new EmailDetails();
        emailDetails.setRecipient(user.getEmail());
        emailDetails.setSubject("Fleet Core Account Password");
        String messaage = String.format("Hello %s %s!\nWelcome to Fleet Core!\nThe password to your account is: %s.\nYou can log in into your account!",
                        user.getFirstName(), user.getLastName(), driverPassword);
        emailDetails.setMsgBody(messaage);

        emailService.sendSimpleMail(emailDetails);

        return createDriverDtoForLogin(user);
    }

    public String deleteDriver(Long driverId){
        try {
            userRepository.deleteByDriverDetailsId(driverId);
            driverDetailsRepository.deleteById(driverId);

            return "Driver deleted successfully!";
        }catch (Exception ex){
            return null;
        }
    }

    public DriverDto getDriverByDriverId(Long driverId){
        try{
            DriverDetails driverDetails = driverDetailsRepository.getDriverDetailsById(driverId);
            User user = userRepository.findUserByDriverDetailsId(driverId);

            DriverDto driverDto = DriverDto.builder()
                    .id(driverDetails.getId())
                    .firstName(user.getFirstName())
                    .lastName(user.getLastName())
                    .email(user.getEmail())
                    .organisationName(user.getOrganisationName())
                    .phoneNumber(user.getPhoneNumber())
                    .role(user.getRole())
                    .ratePerKilometer(driverDetails.getRatePerKilometer())
                    .licenseExpiryDate(driverDetails.getLicenseExpiryDate())
                    .yearsOfExperience(driverDetails.getYearsOfExperience())
                    .totalKilometersDriven(driverDetails.getTotalKilometersDriven())
                    .build();

            driverDto.setImageData(user.getImageData());

            return driverDto;


        }catch (Exception ex){
            throw new RuntimeException(ex);
        }
    }


    public List<DriverDto> getAvailableDrivers(Long adminId){


        return null;
    }

}
