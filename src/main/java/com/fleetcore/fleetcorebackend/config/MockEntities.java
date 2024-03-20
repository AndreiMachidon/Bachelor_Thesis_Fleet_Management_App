package com.fleetcore.fleetcorebackend.config;

import com.fleetcore.fleetcorebackend.entities.*;
import com.fleetcore.fleetcorebackend.entities.enums.FuelType;
import com.fleetcore.fleetcorebackend.entities.enums.MaintenanceType;
import com.fleetcore.fleetcorebackend.entities.enums.VehicleStatus;
import com.fleetcore.fleetcorebackend.repository.*;
import jakarta.annotation.PostConstruct;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
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

    @Autowired
    private MaintenanceRepository maintenanceRepository;

    @Autowired
    private CountryFuelPricesRepository countryFuelPricesRepository;

    @PostConstruct
    public void mockEntities() throws Exception {
        this.mockUser();
        this.mockVehicles();
        this.mockDrivers();
        this.loadElectricityPrices();

    }

    public void mockUser(){
        userRepository.save(
                new User(1L, "Deloitte", "Andrei", "Machidon", "0747019239", "andreimachidon@gmail.com", "admin", "$2a$10$bCqJKbjaqAl8kW5PUni59OPDJs7wU2UzfeTOsuyWGZ2mbu1NhO5qG", null, null));
    }

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

            truck.setVehicleStatus(VehicleStatus.IDLE);


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

        //mock maintenance

        //Example for a vehicle that exceded 6 months or 20.000 km -> SHOULD SHOW SCHEDULE MAINTENANCE
        Calendar cal = Calendar.getInstance();
        cal.set(2023, Calendar.JULY, 1);
        Date date1 = cal.getTime();
        Maintenance maintenance = new Maintenance(1, MaintenanceType.BASIC_SAFETY_CHECK, date1, vehicleList.get(0).getMilenage() - 20000, 250, vehicleList.get(0).getId());
        maintenanceRepository.save(maintenance);

        //Example for a vehicle that did 20.000 km even if the 6 months didn't pass -> SHOULD SHOW SCHEDULE MAINTENANCE
        cal.set(2024, Calendar.JANUARY,  1);
        Date date2 = cal.getTime();
        Maintenance maintenance2 = new Maintenance(2, MaintenanceType.BASIC_SAFETY_CHECK, date2, vehicleList.get(1).getMilenage() - 20000, 250, vehicleList.get(1).getId());
        maintenanceRepository.save(maintenance2);

        //Example for a vehicle that didn't pass 20.000 km and also didn't pass 6 months -> SHOULD SHOW TIME AND KILOMETERS UNTIL NEXT MAINTENANCE
        cal.set(2024, Calendar.FEBRUARY, 27);
        Date date3 = cal.getTime();
        Maintenance maintenance3 = new Maintenance(3, MaintenanceType.BASIC_SAFETY_CHECK, date3, vehicleList.get(2).getMilenage() - 10000, 250, vehicleList.get(2).getId());
        maintenanceRepository.save(maintenance3);

        //Example for a maintenance that is  today -> SHOULD SHOW THAT MAINTENANCE IS TODAY
        cal = Calendar.getInstance();
        Date date4 = cal.getTime();
        Maintenance maintenance4 = new Maintenance(4, MaintenanceType.COMPREHENSIVE_MAINTENANCE_INSPECTION, date4, vehicleList.get(3).getMilenage() - 20000, 800, vehicleList.get(3).getId());
        maintenanceRepository.save(maintenance4);

        //Example for scheduled maintenance in the future -> SHOULD SHOW THAT YOU HAVE A SCHEDULED MAINTENANCE
        cal.set(2024, Calendar.JUNE, 25);
        Date date5 = cal.getTime();
        Maintenance maintenance5 = new Maintenance(5, MaintenanceType.EMISSIONS_EFFICIENCY_SERVICE, date5, vehicleList.get(3).getMilenage() - 20000, 400, vehicleList.get(4).getId());
        maintenanceRepository.save(maintenance5);


    }

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

    public void loadElectricityPrices() {
        try {

            InputStream in = new ClassPathResource("static/Fuel_Prices_Europe.xlsx").getInputStream();
            Workbook workbook = new XSSFWorkbook(in);
            Sheet sheet = workbook.getSheetAt(0);
            Iterator<Row> rows = sheet.iterator();

            if (rows.hasNext()) {
                rows.next();
            }

            while (rows.hasNext()) {
                Row currentRow = rows.next();
                String country = currentRow.getCell(0).getStringCellValue();
                double electricityPrice = currentRow.getCell(1).getNumericCellValue();
                double gasolinePrice = currentRow.getCell(2).getNumericCellValue();
                double dieselPrice = currentRow.getCell(3).getNumericCellValue();

                CountryFuelPrices price = new CountryFuelPrices();
                price.setCountry(country);
                price.setElectricityPrice(electricityPrice);
                price.setGasolinePrice(gasolinePrice);
                price.setDieselPrice(dieselPrice);
                countryFuelPricesRepository.save(price);
            }
            workbook.close();
        } catch (Exception e) {
            e.printStackTrace();
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
