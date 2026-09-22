package com.shuttle.model;

import java.io.Serializable;

public class DutyBlock implements Serializable {
    private static final long serialVersionUID = 1L;

    private String id;
    private String type; // DUTY_START, DUTY_END, TRIP, BREAK, VEHICLE_CHANGE, EMPTY_LEG
    private double startHour; // e.g. 6.5 = 6:30
    private double endHour; // e.g. 8.0 = 8:00
    private String label; // e.g. "2 Pickup 3 Drop", "Lunch Break", "Route A"
    private int pickups;
    private int drops;
    private String vehicleNumber;
    private String details;

    public DutyBlock() {}

    public DutyBlock(String id, String type, double startHour, double endHour,
                     String label, int pickups, int drops, String vehicleNumber, String details) {
        this.id = id;
        this.type = type;
        this.startHour = startHour;
        this.endHour = endHour;
        this.label = label;
        this.pickups = pickups;
        this.drops = drops;
        this.vehicleNumber = vehicleNumber;
        this.details = details;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public double getStartHour() { return startHour; }
    public void setStartHour(double startHour) { this.startHour = startHour; }

    public double getEndHour() { return endHour; }
    public void setEndHour(double endHour) { this.endHour = endHour; }

    public String getLabel() { return label; }
    public void setLabel(String label) { this.label = label; }

    public int getPickups() { return pickups; }
    public void setPickups(int pickups) { this.pickups = pickups; }

    public int getDrops() { return drops; }
    public void setDrops(int drops) { this.drops = drops; }

    public String getVehicleNumber() { return vehicleNumber; }
    public void setVehicleNumber(String vehicleNumber) { this.vehicleNumber = vehicleNumber; }

    public String getDetails() { return details; }
    public void setDetails(String details) { this.details = details; }
}
