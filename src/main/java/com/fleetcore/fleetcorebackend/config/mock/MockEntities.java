package com.fleetcore.fleetcorebackend.config.mock;

import com.fleetcore.fleetcorebackend.config.security.PasswordConfig;
import com.fleetcore.fleetcorebackend.entities.*;
import com.fleetcore.fleetcorebackend.entities.enums.FuelType;
import com.fleetcore.fleetcorebackend.entities.enums.MaintenanceType;
import com.fleetcore.fleetcorebackend.entities.enums.VehicleStatus;
import com.fleetcore.fleetcorebackend.repositories.*;
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

    @Autowired
    private PasswordConfig passwordConfig;

    private User mockedAdminAccount;

    private List<Vehicle> mockedVehicles = new ArrayList<>();

//    @PostConstruct
    private void mockEntities() throws Exception {
        this.mockUser();
        this.mockVehicles();
        this.mockMaintenances();
        this.mockDrivers();
        this.loadElectricityPrices();

    }

    private void mockUser(){
        this.mockedAdminAccount = userRepository.save(
                    new User(0L, "Deloitte", "Andrei", "Machidon", "0747019239", "andreimachidon@gmail.com", "admin", passwordConfig.passwordEncoder().encode("Andrei1234"), null, null));
    }

    private void mockVehicles() throws Exception {
        Vehicle vehicle1 = new Vehicle(0, "Volvo", "FH16", "VIN00001", "PLT0001", 120000, 2022, FuelType.DIESEL, 50000, 300, 35.0, VehicleStatus.IDLE, null, 1);
        vehicle1.setImageData(fetchImageFromInternetAsBase64("https://assets.volvo.com/is/image/VolvoInformationTechnologyAB/volvo-fh-the-highest-trim-level?qlt=82&wid=768&ts=1675756364022&dpr=off&fit=constrain"));
        vehicle1 = vehicleRepository.save(vehicle1);

        Vehicle vehicle2 = new Vehicle(0, "Mercedes-Benz", "Actros", "VIN00002", "PLT0002", 50000, 2023, FuelType.ELECTRIC, 35000, 250, 25.0, VehicleStatus.IDLE, null, 1);
        vehicle2.setImageData(fetchImageFromInternetAsBase64("https://traficmedia.ro/wp-content/uploads/2020/09/20C0493_005.jpg"));
        vehicle2 = vehicleRepository.save(vehicle2);

        Vehicle vehicle3 = new Vehicle(0, "MAN", "TGX", "VIN00003", "PLT0003", 80000, 2022, FuelType.DIESEL, 40000, 300, 29.0, VehicleStatus.IDLE, null, 1);
        vehicle3.setImageData(fetchImageFromInternetAsBase64("https://www.man.eu/ntg_media/media/content_medien/img/bw_master_1/truck/truck_1/tgx/man-lkw-tgx-individual-lion-teaser-1-1_width_534_height_300.jpg"));
        vehicle3 = vehicleRepository.save(vehicle3);

        Vehicle vehicle4 = new Vehicle(0, "Scania", "R 500", "VIN00004", "PLT0004", 150000, 2021, FuelType.DIESEL, 42000, 300, 30.0, VehicleStatus.IDLE, null, 1);
        vehicle4.setImageData(fetchImageFromInternetAsBase64("https://d1hv7ee95zft1i.cloudfront.net/custom/truck-model-photo/original/60a3b86144a02.jpg"));
        vehicle4 = vehicleRepository.save(vehicle4);

        Vehicle vehicle5 = new Vehicle(0, "DAF", "XF", "VIN00005", "PLT0005", 75000, 2023, FuelType.DIESEL, 45000, 300, 28.5, VehicleStatus.IDLE, null, 1);
        vehicle5.setImageData(fetchImageFromInternetAsBase64("https://www.daf.com.au/wp-content/uploads/2020/02/XF_800x400px.jpg"));
        vehicle5 = vehicleRepository.save(vehicle5);

        Vehicle vehicle6 = new Vehicle(0, "VOLVO", "FM", "VIN00006", "PLT0006", 50000, 2022, FuelType.DIESEL, 10000, 150, 18.0, VehicleStatus.IDLE, null, 1);
        vehicle6.setImageData(fetchImageFromInternetAsBase64("https://www.volvotrucks.ro/content/dam/volvo-trucks/markets/master/home/trucks/volvo-fm/specifications/volvo-fm-specifications-cabs.jpg"));
        vehicle6 = vehicleRepository.save(vehicle6);

        Vehicle vehicle7 = new Vehicle(0, "Renault", "T High", "VIN00007", "PLT0007", 110000, 2021, FuelType.ELECTRIC, 43000, 350, 31.0, VehicleStatus.IDLE, null, 1);
        vehicle7.setImageData(fetchImageFromInternetAsBase64("https://cdn-trans.info/uploads/2021/07/3bf9700940edfe5b266c3b72adf.jpg"));
        vehicle7 = vehicleRepository.save(vehicle7);

        Vehicle vehicle8 = new Vehicle(0, "MAN", "TGL", "VIN00008", "PLT0008", 60000, 2022, FuelType.DIESEL, 15000, 100, 10.5, VehicleStatus.IDLE, null, 1);
        vehicle8.setImageData(fetchImageFromInternetAsBase64("https://www.lectura-specs.ro/models/renamed/orig/sasiuri-rigide-tgl-8190-man.jpg"));
        vehicle8 = vehicleRepository.save(vehicle8);

        Vehicle vehicle9 = new Vehicle(0, "Renault", "Premium", "VIN00009", "PLT0009", 90000, 2021, FuelType.DIESEL, 15000, 200, 15.0, VehicleStatus.IDLE, null, 1);
        vehicle9.setImageData(fetchImageFromInternetAsBase64("https://img.oemoffhighway.com/files/base/acbm/ooh/image/2016/03/RenaultTrucks_NewT2016Model.56eac5c0e131c.png?auto=format%2Ccompress&q=70"));
        vehicle9 = vehicleRepository.save(vehicle9);

        Vehicle vehicle10 = new Vehicle(0, "Volvo", "FL", "VIN00010", "PLT0010", 40000, 2023, FuelType.DIESEL, 5000, 80, 9.0, VehicleStatus.IDLE, null, 1);
        vehicle10.setImageData(fetchImageFromInternetAsBase64("https://www.volvotrucks.ro/content/dam/volvo-trucks/markets/master/home/trucks/volvo-fl/specifications/volvo-fl-specifications-cab-icon.jpg"));
        vehicle10 = vehicleRepository.save(vehicle10);

        this.mockedVehicles.addAll(List.of(vehicle1, vehicle2, vehicle3, vehicle4, vehicle5, vehicle6, vehicle7, vehicle8, vehicle9, vehicle10));

    }

    private void mockMaintenances() {
        Calendar cal = Calendar.getInstance();

        //Vehicle 1
        cal.set(2024, Calendar.APRIL, 2);
        Date date11 = cal.getTime();
        Maintenance maintenance11 = new Maintenance(0L, MaintenanceType.EMISSIONS_EFFICIENCY_SERVICE, date11, mockedVehicles.get(0).getMilenage()-10000, 400, mockedVehicles.get(0).getId());
        maintenanceRepository.save(maintenance11);

        cal.set(2024, Calendar.FEBRUARY, 17);
        Date date21 = cal.getTime();
        Maintenance maintenance21 = new Maintenance(0L, MaintenanceType.EMISSIONS_EFFICIENCY_SERVICE, date21, mockedVehicles.get(0).getMilenage() - 30000, 400, mockedVehicles.get(0).getId());
        maintenanceRepository.save(maintenance21);

        cal.set(2023, Calendar.JULY, 1);
        Date date1 = cal.getTime();
        Maintenance maintenance = new Maintenance(0L, MaintenanceType.BASIC_SAFETY_CHECK, date1, mockedVehicles.get(0).getMilenage() - 50000, 250, mockedVehicles.get(0).getId());
        maintenanceRepository.save(maintenance);


        //Vehicle 2
        cal.set(2024, Calendar.AUGUST, 24);
        Date date22 = cal.getTime();
        Maintenance maintenance22 = new Maintenance(0L, MaintenanceType.BASIC_SAFETY_CHECK, date22, mockedVehicles.get(1).getMilenage(), 250, mockedVehicles.get(1).getId());
        maintenanceRepository.save(maintenance22);

        cal.set(2024, Calendar.JANUARY,  1);
        Date date2 = cal.getTime();
        Maintenance maintenance2 = new Maintenance(0L, MaintenanceType.BASIC_SAFETY_CHECK, date2, mockedVehicles.get(1).getMilenage() - 20000, 250, mockedVehicles.get(1).getId());
        maintenanceRepository.save(maintenance2);

        cal.set(2023, Calendar.OCTOBER, 10);
        Date date12 = cal.getTime();
        Maintenance maintenance12 = new Maintenance(0L, MaintenanceType.BASIC_SAFETY_CHECK, date12, mockedVehicles.get(1).getMilenage() - 37000, 250, mockedVehicles.get(1).getId());
        maintenanceRepository.save(maintenance12);


        //Vehicle 3
        cal.set(2024, Calendar.APRIL, 2);
        Date date23 = cal.getTime();
        Maintenance maintenance23 = new Maintenance(0L, MaintenanceType.COMPREHENSIVE_MAINTENANCE_INSPECTION, date23, mockedVehicles.get(2).getMilenage() - 15000, 800, mockedVehicles.get(2).getId());
        maintenanceRepository.save(maintenance23);

        cal.set(2024, Calendar.MARCH, 25);
        Date date13 = cal.getTime();
        Maintenance maintenance13 = new Maintenance(0L, MaintenanceType.COMPREHENSIVE_MAINTENANCE_INSPECTION, date13, mockedVehicles.get(2).getMilenage() - 34000, 800, mockedVehicles.get(2).getId());
        maintenanceRepository.save(maintenance13);

        cal.set(2024, Calendar.JANUARY, 27);
        Date date3 = cal.getTime();
        Maintenance maintenance3 = new Maintenance(0L, MaintenanceType.BASIC_SAFETY_CHECK, date3, mockedVehicles.get(2).getMilenage() - 52000, 250, mockedVehicles.get(2).getId());
        maintenanceRepository.save(maintenance3);


        // Vehicle 4
        cal.set(2024, Calendar.MARCH, 29);
        Date date14 = cal.getTime();
        Maintenance maintenance14 = new Maintenance(0L, MaintenanceType.EMISSIONS_EFFICIENCY_SERVICE, date14, mockedVehicles.get(3).getMilenage() - 5000, 400, mockedVehicles.get(3).getId());
        maintenanceRepository.save(maintenance14);

        cal.set(2024, Calendar.FEBRUARY, 15);
        Date date4 = cal.getTime();
        Maintenance maintenance4 = new Maintenance(0L, MaintenanceType.COMPREHENSIVE_MAINTENANCE_INSPECTION, date4, mockedVehicles.get(3).getMilenage() - 20000, 800, mockedVehicles.get(3).getId());
        maintenanceRepository.save(maintenance4);

        cal.set(2023, Calendar.NOVEMBER, 30);
        Date date24 = cal.getTime();
        Maintenance maintenance24 = new Maintenance(0L, MaintenanceType.EMISSIONS_EFFICIENCY_SERVICE, date24, mockedVehicles.get(3).getMilenage() - 38000, 400, mockedVehicles.get(3).getId());
        maintenanceRepository.save(maintenance24);


        //Vehicle 5
        cal.set(2024, Calendar.MARCH, 22);
        Date date5 = cal.getTime();
        Maintenance maintenance5 = new Maintenance(0L, MaintenanceType.EMISSIONS_EFFICIENCY_SERVICE, date5, mockedVehicles.get(4).getMilenage() - 11000, 400, mockedVehicles.get(4).getId());
        maintenanceRepository.save(maintenance5);

        cal.set(2024, Calendar.JANUARY, 15);
        Date date25 = cal.getTime();
        Maintenance maintenance25 = new Maintenance(0L, MaintenanceType.BASIC_SAFETY_CHECK, date25, mockedVehicles.get(4).getMilenage() - 29000, 250, mockedVehicles.get(4).getId());
        maintenanceRepository.save(maintenance25);

        cal.set(2023, Calendar.AUGUST, 25);
        Date date15 = cal.getTime();
        Maintenance maintenance15 = new Maintenance(0L, MaintenanceType.BASIC_SAFETY_CHECK, date15, mockedVehicles.get(4).getMilenage() - 12000, 250, mockedVehicles.get(4).getId());
        maintenanceRepository.save(maintenance15);


        //Vehicle 6
        cal.set(2024, Calendar.APRIL, 10);
        Date date16 = cal.getTime();
        Maintenance maintenance16 = new Maintenance(0L, MaintenanceType.BASIC_SAFETY_CHECK, date16, mockedVehicles.get(5).getMilenage() - 2000, 250, mockedVehicles.get(5).getId());
        maintenanceRepository.save(maintenance16);

        cal.set(2024, Calendar.JANUARY, 5);
        Date date26 = cal.getTime();
        Maintenance maintenance26 = new Maintenance(0L, MaintenanceType.COMPREHENSIVE_MAINTENANCE_INSPECTION, date26, mockedVehicles.get(5).getMilenage() - 22000, 800, mockedVehicles.get(5).getId());
        maintenanceRepository.save(maintenance26);

        cal.set(2023, Calendar.SEPTEMBER, 15);
        Date date6 = cal.getTime();
        Maintenance maintenance6 = new Maintenance(0L, MaintenanceType.BASIC_SAFETY_CHECK, date6, mockedVehicles.get(5).getMilenage() - 35000, 250, mockedVehicles.get(5).getId());
        maintenanceRepository.save(maintenance6);


        //Vehicle 7
        cal.set(2024, Calendar.MARCH, 31);
        Date date27 = cal.getTime();
        Maintenance maintenance27 = new Maintenance(0L, MaintenanceType.EMISSIONS_EFFICIENCY_SERVICE, date27, mockedVehicles.get(6).getMilenage() - 12000, 400, mockedVehicles.get(6).getId());
        maintenanceRepository.save(maintenance27);

        cal.set(2024, Calendar.JANUARY, 20);
        Date date17 = cal.getTime();
        Maintenance maintenance17 = new Maintenance(0L, MaintenanceType.COMPREHENSIVE_MAINTENANCE_INSPECTION, date17, mockedVehicles.get(6).getMilenage() - 28000, 800, mockedVehicles.get(6).getId());
        maintenanceRepository.save(maintenance17);

        cal.set(2023, Calendar.NOVEMBER, 20);
        Date date7 = cal.getTime();
        Maintenance maintenance7 = new Maintenance(0L, MaintenanceType.COMPREHENSIVE_MAINTENANCE_INSPECTION, date7, mockedVehicles.get(6).getMilenage() - 45000, 800, mockedVehicles.get(6).getId());
        maintenanceRepository.save(maintenance7);


        //Vehicle 8
        cal.set(2024, Calendar.APRIL, 7);
        Date date18 = cal.getTime();
        Maintenance maintenance18 = new Maintenance(0L, MaintenanceType.EMISSIONS_EFFICIENCY_SERVICE, date18, mockedVehicles.get(7).getMilenage() - 12500, 400, mockedVehicles.get(7).getId());
        maintenanceRepository.save(maintenance18);

        cal.set(2024, Calendar.MARCH, 10);
        Date date8 = cal.getTime();
        Maintenance maintenance8 = new Maintenance(0L, MaintenanceType.EMISSIONS_EFFICIENCY_SERVICE, date8, mockedVehicles.get(7).getMilenage() - 28500, 400, mockedVehicles.get(7).getId());
        maintenanceRepository.save(maintenance8);


        //Vehicle 9
        cal.set(2024, Calendar.APRIL, 3);
        Date date19 = cal.getTime();
        Maintenance maintenance19 = new Maintenance(0L, MaintenanceType.BASIC_SAFETY_CHECK, date19, mockedVehicles.get(8).getMilenage() - 12000, 250, mockedVehicles.get(8).getId());
        maintenanceRepository.save(maintenance19);

        cal.set(2023, Calendar.DECEMBER, 5);
        Date date9 = cal.getTime();
        Maintenance maintenance9 = new Maintenance(0L, MaintenanceType.BASIC_SAFETY_CHECK, date9, mockedVehicles.get(8).getMilenage() - 28000, 250, mockedVehicles.get(8).getId());
        maintenanceRepository.save(maintenance9);


        //Vehicle 10
        cal.set(2024, Calendar.MARCH, 25);
        Date date10 = cal.getTime();
        Maintenance maintenance10 = new Maintenance(0L, MaintenanceType.COMPREHENSIVE_MAINTENANCE_INSPECTION, date10, mockedVehicles.get(9).getMilenage() - 14500, 800, mockedVehicles.get(9).getId());
        maintenanceRepository.save(maintenance10);

        cal.set(2023, Calendar.DECEMBER, 15);
        Date date20 = cal.getTime();
        Maintenance maintenance20 = new Maintenance(0L, MaintenanceType.COMPREHENSIVE_MAINTENANCE_INSPECTION, date20, mockedVehicles.get(9).getMilenage() - 29000, 800, mockedVehicles.get(9).getId());
        maintenanceRepository.save(maintenance20);

    }

    public void mockDrivers() throws Exception {

        Calendar cal = Calendar.getInstance();
        cal.set(2026, Calendar.JANUARY, 1);
        Date date1 = cal.getTime();

        DriverDetails driverDetails = new DriverDetails(0L, 0.42, date1, 4, 225000, mockedAdminAccount.getId());
        driverDetails = driverDetailsRepository.save(driverDetails);
        User user = new User(0L, mockedAdminAccount.getOrganisationName(), "Adrian", "Popa", "0747830216", "padrian02@gmail.com", "driver", passwordConfig.passwordEncoder().encode("TestPassword1234"), null, driverDetails.getId());
        userRepository.save(user);

        cal.set(2025, Calendar.MARCH, 21);
        Date date2 = cal.getTime();

        DriverDetails driverDetails1 = new DriverDetails(0L, 0.31, date2, 2, 1200000, mockedAdminAccount.getId());
        driverDetails1 = driverDetailsRepository.save(driverDetails1);
        User user1 = new User(0L, mockedAdminAccount.getOrganisationName(), "Laur", "Chirila", "0783029407", "chirilalaur@gmail.com", "driver", passwordConfig.passwordEncoder().encode("TestPassword1234"), null, driverDetails1.getId());
        userRepository.save(user1);

        cal.set(2028, Calendar.JUNE, 3);
        Date date3 = cal.getTime();

        DriverDetails driverDetails2 = new DriverDetails(0L, 0.56, date3, 6, 345000, mockedAdminAccount.getId());
        driverDetails2 = driverDetailsRepository.save(driverDetails2);
        User user2 = new User(0L, mockedAdminAccount.getOrganisationName(), "Paulescu", "Dragos", "0783929870", "dpaulescu@gmail.com", "driver", passwordConfig.passwordEncoder().encode("TestPassword1234"), null, driverDetails2.getId());
        userRepository.save(user2);

        cal.set(2029, Calendar.FEBRUARY, 2);
        Date date4 = cal.getTime();

        DriverDetails driverDetails3 = new DriverDetails(0L, 0.29, date4, 1, 97000, mockedAdminAccount.getId());
        driverDetails3 = driverDetailsRepository.save(driverDetails3);
        User user3 = new User(0L, mockedAdminAccount.getOrganisationName(), "Bogdan", "Tanase", "0747820175", "bogdantanase27@gmail.com", "driver", passwordConfig.passwordEncoder().encode("TestPassword1234"), null, driverDetails3.getId());
        userRepository.save(user3);

        cal.set(2027, Calendar.SEPTEMBER, 12);
        Date date5 = cal.getTime();

        DriverDetails driverDetails4 = new DriverDetails(5L, 0.38, date5, 3, 168000, mockedAdminAccount.getId());
        driverDetails4 = driverDetailsRepository.save(driverDetails4);
        User user4 = new User(0L, mockedAdminAccount.getOrganisationName(), "Lucian", "Preda", "0748302841", "lucianpreda@gmail.com", "driver", passwordConfig.passwordEncoder().encode("TestPassword1234"), null, driverDetails4.getId());
        userRepository.save(user4);

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
                if(currentRow.getCell(0) == null) {
                    continue;
                }
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
