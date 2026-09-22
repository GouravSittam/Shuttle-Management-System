package com.shuttle.model;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

public class CampusRoute implements Serializable {
    private static final long serialVersionUID = 1L;

    private String id;
    private String name;
    private String code;
    private List<String> stops = new ArrayList<>();
    private int estimatedMinutes;
    private double distanceKm;
    private String assignedVehicle;
    private String assignedDriverId;
    private String frequency; // e.g. "Every 15 mins"
    private boolean active;

    public CampusRoute() {}

    public CampusRoute(String id, String name, String code, List<String> stops,
                       int estimatedMinutes, double distanceKm, String assignedVehicle,
                       String assignedDriverId, String frequency, boolean active) {
        this.id = id;
        this.name = name;
        this.code = code;
        this.stops = stops;
        this.estimatedMinutes = estimatedMinutes;
        this.distanceKm = distanceKm;
        this.assignedVehicle = assignedVehicle;
        this.assignedDriverId = assignedDriverId;
        this.frequency = frequency;
        this.active = active;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public List<String> getStops() { return stops; }
    public void setStops(List<String> stops) { this.stops = stops; }

    public int getEstimatedMinutes() { return estimatedMinutes; }
    public void setEstimatedMinutes(int estimatedMinutes) { this.estimatedMinutes = estimatedMinutes; }

    public double getDistanceKm() { return distanceKm; }
    public void setDistanceKm(double distanceKm) { this.distanceKm = distanceKm; }

    public String getAssignedVehicle() { return assignedVehicle; }
    public void setAssignedVehicle(String assignedVehicle) { this.assignedVehicle = assignedVehicle; }

    public String getAssignedDriverId() { return assignedDriverId; }
    public void setAssignedDriverId(String assignedDriverId) { this.assignedDriverId = assignedDriverId; }

    public String getFrequency() { return frequency; }
    public void setFrequency(String frequency) { this.frequency = frequency; }

    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }
}
