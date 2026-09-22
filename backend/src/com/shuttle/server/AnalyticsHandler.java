package com.shuttle.server;

import com.shuttle.model.Booking;
import com.shuttle.repository.DataStore;
import com.shuttle.util.JsonUtil;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;

import java.io.IOException;
import java.util.*;

public class AnalyticsHandler implements HttpHandler {

    private final DataStore dataStore = DataStore.getInstance();

    @Override
    public void handle(HttpExchange exchange) throws IOException {
        if (CorsHelper.handlePreflight(exchange)) {
            return;
        }

        if (!"GET".equalsIgnoreCase(exchange.getRequestMethod())) {
            CorsHelper.sendJsonResponse(exchange, 405, "{\"error\":\"Method not allowed\"}");
            return;
        }

        List<Booking> bookings = dataStore.getAllBookings();
        int totalBookings = bookings.size();
        int completed = 0;
        int waiting = 0;
        int onGoing = 0;
        int noShows = 0;
        int accepted = 0;

        for (Booking b : bookings) {
            String s = b.getStatus();
            if ("Completed".equalsIgnoreCase(s) || "Dropped".equalsIgnoreCase(s)) completed++;
            else if ("Waiting".equalsIgnoreCase(s) || "Requested".equalsIgnoreCase(s)) waiting++;
            else if ("On Going".equalsIgnoreCase(s)) onGoing++;
            else if ("No Show".equalsIgnoreCase(s)) noShows++;
            else if ("Accepted".equalsIgnoreCase(s)) accepted++;
        }

        // Peak Hours demand curve (hour 6 to 22)
        int[] hours = {6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22};
        int[] demand = {18, 42, 115, 180, 145, 165, 120, 95, 80, 135, 195, 215, 180, 125, 75, 45, 20};
        int[] capacity = {40, 60, 130, 190, 160, 180, 140, 120, 110, 150, 200, 220, 190, 140, 90, 60, 40};

        List<Map<String, Object>> hourlyData = new ArrayList<>();
        for (int i = 0; i < hours.length; i++) {
            Map<String, Object> point = new LinkedHashMap<>();
            point.put("hour", String.format("%02d:00", hours[i]));
            point.put("demand", demand[i]);
            point.put("capacity", capacity[i]);
            point.put("utilization", (int) Math.round((demand[i] * 100.0) / capacity[i]));
            hourlyData.add(point);
        }

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("totalBookings", totalBookings);
        result.put("completedTrips", completed);
        result.put("waitingPassengers", waiting);
        result.put("onGoingTrips", onGoing);
        result.put("noShows", noShows);
        result.put("acceptedTrips", accepted);
        result.put("activeDrivers", 6);
        result.put("totalDrivers", 8);
        result.put("fleetUtilizationPct", 88.4);
        result.put("onTimeArrivalPct", 95.8);
        result.put("avgWaitMinutes", 4.2);
        result.put("hourlyPeakDemand", hourlyData);

        CorsHelper.sendJsonResponse(exchange, 200, JsonUtil.toJson(result));
    }
}
