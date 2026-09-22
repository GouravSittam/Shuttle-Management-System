package com.shuttle.server;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;

import java.io.IOException;

public class HealthHandler implements HttpHandler {
    @Override
    public void handle(HttpExchange exchange) throws IOException {
        if (CorsHelper.handlePreflight(exchange)) return;
        String json = "{\"status\":\"UP\",\"service\":\"Campus Shuttle Transit API\",\"version\":\"1.0.0\",\"platform\":\"Java 8\",\"port\":" + ShuttleApiServer.PORT + "}";
        CorsHelper.sendJsonResponse(exchange, 200, json);
    }
}
