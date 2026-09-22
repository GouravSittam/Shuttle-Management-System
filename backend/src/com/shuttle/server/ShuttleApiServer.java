package com.shuttle.server;

import com.sun.net.httpserver.HttpServer;

import java.io.IOException;
import java.net.InetSocketAddress;
import java.util.concurrent.Executors;

public class ShuttleApiServer {

    public static int PORT = 8085;

    public static void main(String[] args) {
        if (args != null && args.length > 0) {
            try {
                PORT = Integer.parseInt(args[0]);
            } catch (NumberFormatException ignored) {}
        }
        String envPort = System.getenv("PORT");
        if (envPort != null && !envPort.isEmpty()) {
            try {
                PORT = Integer.parseInt(envPort);
            } catch (NumberFormatException ignored) {}
        }

        try {
            HttpServer server = HttpServer.create(new InetSocketAddress("0.0.0.0", PORT), 0);

            server.createContext("/api/health", new HealthHandler());
            server.createContext("/api/bookings", new BookingHandler());
            server.createContext("/api/drivers", new DriverHandler());
            server.createContext("/api/routes", new RouteHandler());
            server.createContext("/api/analytics", new AnalyticsHandler());

            server.setExecutor(Executors.newFixedThreadPool(16));
            server.start();

            System.out.println("=================================================");
            System.out.println("  Campus Shuttle Transit REST API Server Started ");
            System.out.println("  Port: " + PORT);
            System.out.println("  Health: http://localhost:" + PORT + "/api/health");
            System.out.println("  Bookings: http://localhost:" + PORT + "/api/bookings");
            System.out.println("  Drivers: http://localhost:" + PORT + "/api/drivers");
            System.out.println("  Routes: http://localhost:" + PORT + "/api/routes");
            System.out.println("  Analytics: http://localhost:" + PORT + "/api/analytics");
            System.out.println("=================================================");

        } catch (IOException e) {
            System.err.println("Failed to start server: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
