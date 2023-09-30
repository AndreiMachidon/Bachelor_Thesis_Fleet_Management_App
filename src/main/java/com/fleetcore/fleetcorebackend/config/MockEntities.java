package com.fleetcore.fleetcorebackend.config;

import com.fleetcore.fleetcorebackend.entities.User;
import com.fleetcore.fleetcorebackend.entities.Vehicle;
import com.fleetcore.fleetcorebackend.entities.enums.FuelType;
import com.fleetcore.fleetcorebackend.entities.enums.VehicleStatus;
import com.fleetcore.fleetcorebackend.repository.UserRepository;
import com.fleetcore.fleetcorebackend.repository.VehicleRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLConnection;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;

@Service
public class MockEntities {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private VehicleRepository vehicleRepository;

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







    public String fetchImageFromInternetAsBase64(String imageUrl) throws IOException, MalformedURLException {
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
