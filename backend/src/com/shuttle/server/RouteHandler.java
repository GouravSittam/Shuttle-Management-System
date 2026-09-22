package com.shuttle.server;

import com.shuttle.model.CampusRoute;
import com.shuttle.repository.DataStore;
import com.shuttle.util.JsonUtil;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.*;

public class RouteHandler implements HttpHandler {

    private final DataStore dataStore = DataStore.getInstance();

    @Override
    public void handle(HttpExchange exchange) throws IOException {
        if (CorsHelper.handlePreflight(exchange)) {
            return;
        }

        String method = exchange.getRequestMethod().toUpperCase();
        try {
            if ("GET".equals(method)) {
                List<CampusRoute> routes = dataStore.getAllRoutes();
                CorsHelper.sendJsonResponse(exchange, 200, JsonUtil.toJson(routes));
            } else if ("POST".equals(method)) {
                handleCreateRoute(exchange);
            } else {
                CorsHelper.sendJsonResponse(exchange, 405, "{\"error\":\"Method not allowed\"}");
            }
        } catch (Exception e) {
            e.printStackTrace();
            CorsHelper.sendJsonResponse(exchange, 500, "{\"error\":\"Internal error: " + JsonUtil.escape(e.getMessage()) + "\"}");
        }
    }

    @SuppressWarnings("unchecked")
    private void handleCreateRoute(HttpExchange exchange) throws IOException {
        BufferedReader reader = new BufferedReader(new InputStreamReader(exchange.getRequestBody(), StandardCharsets.UTF_8));
        StringBuilder sb = new StringBuilder();
        String line;
        while ((line = reader.readLine()) != null) sb.append(line);

        Object parsed = JsonUtil.parseJson(sb.toString());
        if (parsed instanceof Map) {
            Map<String, Object> map = (Map<String, Object>) parsed;
            String id = "rt-" + UUID.randomUUID().toString().substring(0, 4);
            String name = String.valueOf(map.getOrDefault("name", "New Campus Route"));
            String code = String.valueOf(map.getOrDefault("code", "NCR-01"));
            int mins = map.get("estimatedMinutes") instanceof Number ? ((Number) map.get("estimatedMinutes")).intValue() : 20;
            double dist = map.get("distanceKm") instanceof Number ? ((Number) map.get("distanceKm")).doubleValue() : 4.0;
            String veh = String.valueOf(map.getOrDefault("assignedVehicle", "NB-002-RF"));
            String drv = String.valueOf(map.getOrDefault("assignedDriverId", "drv-1"));
            String freq = String.valueOf(map.getOrDefault("frequency", "Every 15 mins"));

            List<String> stops = new ArrayList<>();
            Object stopsObj = map.get("stops");
            if (stopsObj instanceof List) {
                for (Object s : (List<?>) stopsObj) {
                    stops.add(String.valueOf(s));
                }
            } else {
                stops.add("Main Gate");
                stops.add("Central Library");
            }

            CampusRoute route = new CampusRoute(id, name, code, stops, mins, dist, veh, drv, freq, true);
            dataStore.saveRoute(route);
            CorsHelper.sendJsonResponse(exchange, 201, JsonUtil.toJson(route));
        } else {
            CorsHelper.sendJsonResponse(exchange, 400, "{\"error\":\"Invalid JSON\"}");
        }
    }
}
