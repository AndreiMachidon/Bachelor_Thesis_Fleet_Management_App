package com.fleetcore.fleetcorebackend.services;

import com.fleetcore.fleetcorebackend.dto.DriverDto;
import com.fleetcore.fleetcorebackend.dto.RouteDto;
import com.fleetcore.fleetcorebackend.dto.WaypointDto;
import com.fleetcore.fleetcorebackend.email.EmailDetails;
import com.fleetcore.fleetcorebackend.email.EmailServiceImpl;
import com.fleetcore.fleetcorebackend.entities.DriverDetails;
import com.fleetcore.fleetcorebackend.entities.User;
import com.fleetcore.fleetcorebackend.entities.enums.RouteStatus;
import com.fleetcore.fleetcorebackend.entities.routes.Route;
import com.fleetcore.fleetcorebackend.exceptions.AuthException;
import com.fleetcore.fleetcorebackend.repositories.DriverDetailsRepository;
import com.fleetcore.fleetcorebackend.repositories.RouteRepository;
import com.fleetcore.fleetcorebackend.repositories.UserRepository;
import com.fleetcore.fleetcorebackend.util.DriverPasswordGenerator;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@RequiredArgsConstructor
@Service
public class DriverService {

    private final DriverDetailsRepository driverDetailsRepository;

    private final UserRepository userRepository;

    private final EmailServiceImpl emailService;

    private final PasswordEncoder passwordEncoder;

    private final RouteRepository routeRepository;

    private final RouteService routeService;

    private final WaypointService waypointService;


    public List<DriverDto> getDriversByAdminId(Long adminId) {
        List<DriverDetails> driverDetails = driverDetailsRepository.getDriverDetailsByAdminId(adminId);
        List<DriverDto> drivers = new ArrayList<>();

        for (DriverDetails details : driverDetails) {
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

    public DriverDto createDriverDtoForLogin(User user) {
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

    public DriverDto registerDriver(Long adminId, DriverDto driverDto) {

        User existingUser = userRepository.findByEmail(driverDto.getEmail()).orElse(null);

        if(existingUser != null){
            throw new AuthException("A user with this email is already registered", HttpStatus.CONFLICT);
        }


        DriverDetails driverDetails = DriverDetails.builder()
                .adminId(adminId)
                .ratePerKilometer(driverDto.getRatePerKilometer())
                .licenseExpiryDate(driverDto.getLicenseExpiryDate())
                .yearsOfExperience(driverDto.getYearsOfExperience())
                .build();

        driverDetails = driverDetailsRepository.save(driverDetails);

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
        String htmlContent = "<div style='color: #333;'>" +
                "<h2>Hello " + user.getFirstName() + " " + user.getLastName() + "!</h2>" +
                "<p>Welcome to <strong>Fleet Core</strong>! Your driver account has been created.</p>" +
                "<p>You are now registered for organisation: <strong>" + user.getOrganisationName() + "</strong>.</p>" +
                "<p>Your password is: <strong>" + driverPassword + "</strong></p>" +
                "</div>";
        emailDetails.setMsgBody(htmlContent);
        emailService.sendHtmlMail(emailDetails);

        return createDriverDtoForLogin(user);
    }

    public String deleteDriver(Long driverId) {
        try {
            userRepository.deleteByDriverDetailsId(driverId);
            driverDetailsRepository.deleteById(driverId);

            return "Driver deleted successfully!";
        } catch (Exception ex) {
            return null;
        }
    }

    public DriverDto getDriverByDriverId(Long driverId) {
        try {
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


        } catch (Exception ex) {
            throw new RuntimeException(ex);
        }
    }


    public List<DriverDto> getAvailableDrivers(Long adminId, LocalDateTime startTime, LocalDateTime arrivalTime) {
        Date dateStartTime = java.sql.Timestamp.valueOf(startTime);
        Date dateArrivalTime = java.sql.Timestamp.valueOf(arrivalTime);

        List<DriverDto> allDrivers = getDriversByAdminId(adminId);
        List<DriverDto> availableDrivers = new ArrayList<>();

        for (DriverDto driver : allDrivers) {
            List<Route> driverRoutes = routeRepository.getAllByDriverId(driver.getId());

            boolean isAvailable = true;
            for (Route route : driverRoutes) {
                Date routeStart = route.getStartTime();
                Date routeEnd = route.getArrivalTime();

                if (!(routeEnd.before(dateStartTime) || routeStart.after(dateArrivalTime))) {
                    isAvailable = false;
                    break;
                }
            }

            if (isAvailable) {
                availableDrivers.add(driver);
            }
        }

        return availableDrivers;

    }

    public List<RouteDto> getAllUpcomingRoutesForDriver(Long driverId){
        List<Route> driverRoutes = routeRepository.getAllByDriverId(driverId).stream()
                .filter(route -> route.getRouteStatus().equals(RouteStatus.UPCOMING) || route.getRouteStatus().equals(RouteStatus.IN_PROGRESS))
                .toList();

        List<RouteDto> routeDtoList = new ArrayList<>();
        for(Route route: driverRoutes){
            RouteDto routeDto = routeService.convertEntityToDto(route);
            List<WaypointDto> waypointDtoList = waypointService.convertEntitiesToDtos(route.getWaypoints());
            routeDto.setWaypoints(waypointDtoList);
            routeDtoList.add(routeDto);
        }

        return routeDtoList;
    }

}
