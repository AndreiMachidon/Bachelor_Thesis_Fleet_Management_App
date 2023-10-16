package com.fleetcore.fleetcorebackend.config;

import com.fleetcore.fleetcorebackend.entities.DriverDetails;
import com.fleetcore.fleetcorebackend.entities.User;
import com.fleetcore.fleetcorebackend.entities.Vehicle;
import com.fleetcore.fleetcorebackend.entities.enums.FuelType;
import com.fleetcore.fleetcorebackend.entities.enums.VehicleStatus;
import com.fleetcore.fleetcorebackend.repository.DriverDetailsRepository;
import com.fleetcore.fleetcorebackend.repository.UserRepository;
import com.fleetcore.fleetcorebackend.repository.VehicleRepository;
import jakarta.annotation.PostConstruct;
import org.mapstruct.control.MappingControl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLConnection;
import java.util.*;

@Service
public class MockEntities {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private VehicleRepository vehicleRepository;

    @Autowired
    private DriverDetailsRepository driverDetailsRepository;

    @PostConstruct
    public void mockUser(){
        userRepository.save(
                new User(1L, "Deloitte", "Andrei", "Machidon", "0747019239", "andreimachidon@gmail.com", "admin", "$2a$10$bCqJKbjaqAl8kW5PUni59OPDJs7wU2UzfeTOsuyWGZ2mbu1NhO5qG", null, null));
    }

    @PostConstruct
    public void mockVehicles() throws Exception {
        List<Vehicle> vehicleList = new ArrayList<>();

        String[][] truckData = {
                {"Volvo", "FH16", "https://assets.volvo.com/is/image/VolvoInformationTechnologyAB/volvo-fh-the-highest-trim-level?qlt=82&wid=768&ts=1675756364022&dpr=off&fit=constrain", FuelType.DIESEL.name(), "44000", "500", "16.1"},
                {"Mercedes-Benz", "Actros", "https://traficmedia.ro/wp-content/uploads/2020/09/20C0493_005.jpg", FuelType.ELECTRIC.name(), "40000", "480", "15.6"},
                {"MAN", "TGX", "https://www.man.eu/ntg_media/media/content_medien/img/bw_master_1/truck/truck_1/tgx/man-lkw-tgx-individual-lion-teaser-1-1_width_534_height_300.jpg", FuelType.DIESEL.name(), "44000", "500", "12.4"},
                {"Scania", "R 500", "https://d1hv7ee95zft1i.cloudfront.net/custom/truck-model-photo/original/60a3b86144a02.jpg", FuelType.DIESEL.name(), "44000", "500", "13.0"},
                {"DAF", "XF", "https://www.daf.com.au/wp-content/uploads/2020/02/XF_800x400px.jpg", FuelType.DIESEL.name(), "44000", "500", "12.9"},
                {"VOLVO", "FM","https://www.volvotrucks.ro/content/dam/volvo-trucks/markets/master/home/trucks/volvo-fm/specifications/volvo-fm-specifications-cabs.jpg", FuelType.DIESEL.name(), "40000", "480", "12.8"},
                {"Renault", "T High", "https://cdn-trans.info/uploads/2021/07/3bf9700940edfe5b266c3b72adf.jpg", FuelType.ELECTRIC.name(), "44000", "500", "13.0"},
                {"MAN", "TGL", "https://www.lectura-specs.ro/models/renamed/orig/sasiuri-rigide-tgl-8190-man.jpg", FuelType.DIESEL.name(), "12000", "150", "6.9"},
                {"Renault", "Premium", "https://img.oemoffhighway.com/files/base/acbm/ooh/image/2016/03/RenaultTrucks_NewT2016Model.56eac5c0e131c.png?auto=format%2Ccompress&q=70", FuelType.DIESEL.name(), "44000", "500", "11.0"},
                {"Volvo", "FL", "https://www.volvotrucks.ro/content/dam/volvo-trucks/markets/master/home/trucks/volvo-fl/specifications/volvo-fl-specifications-cab-icon.jpg", FuelType.DIESEL.name(), "18000", "200", "7.2"}
        };

        for (int i = 0; i < truckData.length; i++) {
            String make = truckData[i][0];
            String model = truckData[i][1];
            String imageUrl = truckData[i][2];
            String fuelType = truckData[i][3];
            double cargoCapacity = Double.parseDouble(truckData[i][4]);
            double fuelCapacity = Double.parseDouble(truckData[i][5]);
            double fuelConsumption = Double.parseDouble(truckData[i][6]);

            Vehicle truck = new Vehicle();
            truck.setMake(make);
            truck.setModel(model);
            truck.setVin("VIN" + String.format("%05d", i + 1));
            truck.setLincesePlate("PLT" + String.format("%04d", i + 1));
            truck.setMilenage(50000 + (Math.random() * 200000));
            truck.setYearOfManufacture(2020 + (int)(Math.random() * 4));
            truck.setFuelType(FuelType.valueOf(fuelType));
            truck.setCargoCapacity(cargoCapacity);
            truck.setFuelCapacity(fuelCapacity);
            truck.setFuelConsumption(fuelConsumption);

            if (i < 4) {
                truck.setVehicleStatus(VehicleStatus.IDLE);
            } else if (i < 7) {
                truck.setVehicleStatus(VehicleStatus.ON_ROUTE);
            } else {
                truck.setVehicleStatus(VehicleStatus.IN_SERVICE);
            }

            try {
                String base64ImageData = fetchImageFromInternetAsBase64(imageUrl);
                truck.setImageData(base64ImageData);
            } catch (Exception ex) {
                truck.setImageData(null);
            }

            truck.setAdminId(1);
            vehicleList.add(truck);
        }

        vehicleRepository.saveAll(vehicleList);
    }

    @PostConstruct
    public void mockDrivers() throws Exception {

        Calendar cal = Calendar.getInstance();
        cal.set(2025, Calendar.JANUARY, 1);
        Date date1 = cal.getTime();

        DriverDetails driverDetails = new DriverDetails(1L, 0.5, date1, 4, 150000, 1L);
        driverDetailsRepository.save(driverDetails);
        User user = new User(2L, "Deloitte", "Marian", "Radu", "0747019239", "andreimachidon09@gmail.com", "driver", "$2a$12$/6d2ZYTIv5x5l5hi48Uad.SHszfvO00uYC7KYybzzFAZSsmDrPaNq", null, 1L);
        userRepository.save(user);

        cal.set(2024, Calendar.JANUARY, 1);
        Date date2 = cal.getTime();

        DriverDetails driverDetails1 = new DriverDetails(2L, 0.5,date2, 4, 250000, 1L);
        driverDetailsRepository.save(driverDetails1);
        User user1 = new User(3L, "Deloitte", "Laur", "Chrila", "0747019239", "andreimachidon03@gmail.com", "driver", "$2a$12$/6d2ZYTIv5x5l5hi48Uad.SHszfvO00uYC7KYybzzFAZSsmDrPaNq", null, 2L);
        userRepository.save(user1);

        cal.set(2024, Calendar.JANUARY, 1);
        Date date3 = cal.getTime();

        DriverDetails driverDetails2 = new DriverDetails(3L, 0.5, date3, 4, 100000, 1L);
        driverDetailsRepository.save(driverDetails2);
        User user2 = new User(4L, "Deloitte", "Paulescu", "Dragos", "0747019239", "andreimachidon05@gmail.com", "driver", "$2a$12$/6d2ZYTIv5x5l5hi48Uad.SHszfvO00uYC7KYybzzFAZSsmDrPaNq", null, 3L);
        userRepository.save(user2);

        cal.set(2027, Calendar.JANUARY, 1);
        Date date4 = cal.getTime();

        DriverDetails driverDetails3 = new DriverDetails(4L, 0.5, date4, 4, 200000, 1L);
        driverDetailsRepository.save(driverDetails3);
        User user3 = new User(5L, "Deloitte", "Simion", "Mircea", "0747019239", "andreimachidon06@gmail.com", "driver", "$2a$12$/6d2ZYTIv5x5l5hi48Uad.SHszfvO00uYC7KYybzzFAZSsmDrPaNq", null, 4L);
        userRepository.save(user3);

        cal.set(2025, Calendar.JANUARY, 1);
        Date date5 = cal.getTime();

        DriverDetails driverDetails4 = new DriverDetails(5L, 0.5, date5, 4, 175000, 1L);
        driverDetailsRepository.save(driverDetails4);
        User user4 = new User(6L, "Deloitte", "Popescu", "Marius", "0747019239", "andreimachidon07@gmail.com", "driver", "$2a$12$/6d2ZYTIv5x5l5hi48Uad.SHszfvO00uYC7KYybzzFAZSsmDrPaNq", null, 5L);
        userRepository.save(user4);

        cal.set(2030, Calendar.JANUARY, 1);
        Date date6 = cal.getTime();

        DriverDetails driverDetails5 = new DriverDetails(6L, 0.5, date6, 4, 190000, 1L);
        driverDetailsRepository.save(driverDetails5);
        User user5 = new User(7L, "Deloitte", "Chiritescu", "Rares", "0747019239", "andreimachidon08@gmail.com", "driver", "$2a$12$/6d2ZYTIv5x5l5hi48Uad.SHszfvO00uYC7KYybzzFAZSsmDrPaNq", null, 6L);
        userRepository.save(user5);

        try {
            String base64ImageData = fetchImageFromInternetAsBase64("https://media.istockphoto.com/id/1300512215/photo/headshot-portrait-of-smiling-ethnic-businessman-in-office.jpg?s=612x612&w=0&k=20&c=QjebAlXBgee05B3rcLDAtOaMtmdLjtZ5Yg9IJoiy-VY=");
            user.setImageData(base64ImageData);
        } catch (Exception ex) {
            user.setImageData(null);
        }
    }


    public String fetchImageFromInternetAsBase64(String imageUrl) throws IOException {
        URL url = new URL(imageUrl);
        URLConnection connection = url.openConnection();
        try (InputStream inputStream = connection.getInputStream();
             ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {
            byte[] buffer = new byte[4096];
            int bytesRead;
            while ((bytesRead = inputStream.read(buffer)) != -1) {
                outputStream.write(buffer, 0, bytesRead);
            }
            byte[] imageData = outputStream.toByteArray();
            return Base64.getEncoder().encodeToString(imageData);
        }
    }
}
