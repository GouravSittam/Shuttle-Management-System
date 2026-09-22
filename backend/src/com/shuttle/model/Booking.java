package com.shuttle.model;

import java.io.Serializable;

public class Booking implements Serializable {
    private static final long serialVersionUID = 1L;

    private String id;
    private String employeeName;
    private String employeeId;
    private String status; // Accepted, Waiting, Requested, On Going, Completed, Dropped, Declined, No Show, Cancelled
    private String fromLocation;
    private String toLocation;
    private String vehicleNumber;
    private String vehicleDetails; // e.g. UA3282 White Bus | 12 Seater
    private String requestedPickupTime; // e.g. 11:21
    private String pickupTime; // e.g. 12:25
    private String plannedDropTime; // e.g. 11:32
    private String actualDropTime; // e.g. 11:32 or 12:40
    private String date; // e.g. 2024-12-16
    private String driverName; // e.g. Steve Smith
    private String driverPhone; // e.g. +1-322-493-3292
    private double driverRating; // e.g. 4.5
    private String notes;
    private int delayMinutes; // e.g. +5

    public Booking() {}

    public Booking(String id, String employeeName, String employeeId, String status,
                   String fromLocation, String toLocation, String vehicleNumber, String vehicleDetails,
                   String requestedPickupTime, String pickupTime, String plannedDropTime,
                   String actualDropTime, String date, String driverName, String driverPhone,
                   double driverRating, String notes, int delayMinutes) {
        this.id = id;
        this.employeeName = employeeName;
        this.employeeId = employeeId;
        this.status = status;
        this.fromLocation = fromLocation;
        this.toLocation = toLocation;
        this.vehicleNumber = vehicleNumber;
        this.vehicleDetails = vehicleDetails;
        this.requestedPickupTime = requestedPickupTime;
        this.pickupTime = pickupTime;
        this.plannedDropTime = plannedDropTime;
        this.actualDropTime = actualDropTime;
        this.date = date;
        this.driverName = driverName;
        this.driverPhone = driverPhone;
        this.driverRating = driverRating;
        this.notes = notes;
        this.delayMinutes = delayMinutes;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getEmployeeName() { return employeeName; }
    public void setEmployeeName(String employeeName) { this.employeeName = employeeName; }

    public String getEmployeeId() { return employeeId; }
    public void setEmployeeId(String employeeId) { this.employeeId = employeeId; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getFromLocation() { return fromLocation; }
    public void setFromLocation(String fromLocation) { this.fromLocation = fromLocation; }

    public String getToLocation() { return toLocation; }
    public void setToLocation(String toLocation) { this.toLocation = toLocation; }

    public String getVehicleNumber() { return vehicleNumber; }
    public void setVehicleNumber(String vehicleNumber) { this.vehicleNumber = vehicleNumber; }

    public String getVehicleDetails() { return vehicleDetails; }
    public void setVehicleDetails(String vehicleDetails) { this.vehicleDetails = vehicleDetails; }

    public String getRequestedPickupTime() { return requestedPickupTime; }
    public void setRequestedPickupTime(String requestedPickupTime) { this.requestedPickupTime = requestedPickupTime; }

    public String getPickupTime() { return pickupTime; }
    public void setPickupTime(String pickupTime) { this.pickupTime = pickupTime; }

    public String getPlannedDropTime() { return plannedDropTime; }
    public void setPlannedDropTime(String plannedDropTime) { this.plannedDropTime = plannedDropTime; }

    public String getActualDropTime() { return actualDropTime; }
    public void setActualDropTime(String actualDropTime) { this.actualDropTime = actualDropTime; }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }

    public String getDriverName() { return driverName; }
    public void setDriverName(String driverName) { this.driverName = driverName; }

    public String getDriverPhone() { return driverPhone; }
    public void setDriverPhone(String driverPhone) { this.driverPhone = driverPhone; }

    public double getDriverRating() { return driverRating; }
    public void setDriverRating(double driverRating) { this.driverRating = driverRating; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public int getDelayMinutes() { return delayMinutes; }
    public void setDelayMinutes(int delayMinutes) { this.delayMinutes = delayMinutes; }
}
