package com.shuttle.model;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

public class Driver implements Serializable {
    private static final long serialVersionUID = 1L;

    private String id;
    private String name;
    private String phone;
    private String status; // Online, Offline, On Trip, On Break
    private double rating;
    private String vehicleNumber;
    private String vehicleDetails;
    private double dutyStartHour; // e.g. 6.0
    private double dutyEndHour; // e.g. 18.0
    private List<DutyBlock> blocks = new ArrayList<>();

    public Driver() {}

    public Driver(String id, String name, String phone, String status, double rating,
                  String vehicleNumber, String vehicleDetails, double dutyStartHour, double dutyEndHour) {
        this.id = id;
        this.name = name;
        this.phone = phone;
        this.status = status;
        this.rating = rating;
        this.vehicleNumber = vehicleNumber;
        this.vehicleDetails = vehicleDetails;
        this.dutyStartHour = dutyStartHour;
        this.dutyEndHour = dutyEndHour;
        this.blocks = new ArrayList<>();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public double getRating() { return rating; }
    public void setRating(double rating) { this.rating = rating; }

    public String getVehicleNumber() { return vehicleNumber; }
    public void setVehicleNumber(String vehicleNumber) { this.vehicleNumber = vehicleNumber; }

    public String getVehicleDetails() { return vehicleDetails; }
    public void setVehicleDetails(String vehicleDetails) { this.vehicleDetails = vehicleDetails; }

    public double getDutyStartHour() { return dutyStartHour; }
    public void setDutyStartHour(double dutyStartHour) { this.dutyStartHour = dutyStartHour; }

    public double getDutyEndHour() { return dutyEndHour; }
    public void setDutyEndHour(double dutyEndHour) { this.dutyEndHour = dutyEndHour; }

    public List<DutyBlock> getBlocks() { return blocks; }
    public void setBlocks(List<DutyBlock> blocks) { this.blocks = blocks; }

    public void addBlock(DutyBlock block) {
        this.blocks.add(block);
    }
}
