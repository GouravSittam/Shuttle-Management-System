package com.shuttle.util;

import com.shuttle.model.*;

import java.util.*;

public class JsonUtil {

    public static String escape(String s) {
        if (s == null) return "";
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < s.length(); i++) {
            char ch = s.charAt(i);
            switch (ch) {
                case '"': sb.append("\\\""); break;
                case '\\': sb.append("\\\\"); break;
                case '\b': sb.append("\\b"); break;
                case '\f': sb.append("\\f"); break;
                case '\n': sb.append("\\n"); break;
                case '\r': sb.append("\\r"); break;
                case '\t': sb.append("\\t"); break;
                default:
                    if (ch < ' ') {
                        String t = "000" + Integer.toHexString(ch);
                        sb.append("\\u").append(t.substring(t.length() - 4));
                    } else {
                        sb.append(ch);
                    }
            }
        }
        return sb.toString();
    }

    public static String toJson(Object obj) {
        if (obj == null) return "null";

        if (obj instanceof String) {
            return "\"" + escape((String) obj) + "\"";
        }
        if (obj instanceof Number || obj instanceof Boolean) {
            return obj.toString();
        }
        if (obj instanceof List) {
            List<?> list = (List<?>) obj;
            StringBuilder sb = new StringBuilder("[");
            for (int i = 0; i < list.size(); i++) {
                if (i > 0) sb.append(",");
                sb.append(toJson(list.get(i)));
            }
            sb.append("]");
            return sb.toString();
        }
        if (obj instanceof Map) {
            Map<?, ?> map = (Map<?, ?>) obj;
            StringBuilder sb = new StringBuilder("{");
            int i = 0;
            for (Map.Entry<?, ?> entry : map.entrySet()) {
                if (i > 0) sb.append(",");
                sb.append("\"").append(escape(String.valueOf(entry.getKey()))).append("\":");
                sb.append(toJson(entry.getValue()));
                i++;
            }
            sb.append("}");
            return sb.toString();
        }
        if (obj instanceof Booking) {
            Booking b = (Booking) obj;
            return "{"
                + "\"id\":\"" + escape(b.getId()) + "\","
                + "\"employeeName\":\"" + escape(b.getEmployeeName()) + "\","
                + "\"employeeId\":\"" + escape(b.getEmployeeId()) + "\","
                + "\"status\":\"" + escape(b.getStatus()) + "\","
                + "\"fromLocation\":\"" + escape(b.getFromLocation()) + "\","
                + "\"toLocation\":\"" + escape(b.getToLocation()) + "\","
                + "\"vehicleNumber\":\"" + escape(b.getVehicleNumber()) + "\","
                + "\"vehicleDetails\":\"" + escape(b.getVehicleDetails()) + "\","
                + "\"requestedPickupTime\":\"" + escape(b.getRequestedPickupTime()) + "\","
                + "\"pickupTime\":\"" + escape(b.getPickupTime()) + "\","
                + "\"plannedDropTime\":\"" + escape(b.getPlannedDropTime()) + "\","
                + "\"actualDropTime\":\"" + escape(b.getActualDropTime()) + "\","
                + "\"date\":\"" + escape(b.getDate()) + "\","
                + "\"driverName\":\"" + escape(b.getDriverName()) + "\","
                + "\"driverPhone\":\"" + escape(b.getDriverPhone()) + "\","
                + "\"driverRating\":" + b.getDriverRating() + ","
                + "\"notes\":\"" + escape(b.getNotes()) + "\","
                + "\"delayMinutes\":" + b.getDelayMinutes()
                + "}";
        }
        if (obj instanceof DutyBlock) {
            DutyBlock blk = (DutyBlock) obj;
            return "{"
                + "\"id\":\"" + escape(blk.getId()) + "\","
                + "\"type\":\"" + escape(blk.getType()) + "\","
                + "\"startHour\":" + blk.getStartHour() + ","
                + "\"endHour\":" + blk.getEndHour() + ","
                + "\"label\":\"" + escape(blk.getLabel()) + "\","
                + "\"pickups\":" + blk.getPickups() + ","
                + "\"drops\":" + blk.getDrops() + ","
                + "\"vehicleNumber\":\"" + escape(blk.getVehicleNumber()) + "\","
                + "\"details\":\"" + escape(blk.getDetails()) + "\""
                + "}";
        }
        if (obj instanceof Driver) {
            Driver d = (Driver) obj;
            StringBuilder sb = new StringBuilder("{");
            sb.append("\"id\":\"").append(escape(d.getId())).append("\",");
            sb.append("\"name\":\"").append(escape(d.getName())).append("\",");
            sb.append("\"phone\":\"").append(escape(d.getPhone())).append("\",");
            sb.append("\"status\":\"").append(escape(d.getStatus())).append("\",");
            sb.append("\"rating\":").append(d.getRating()).append(",");
            sb.append("\"vehicleNumber\":\"").append(escape(d.getVehicleNumber())).append("\",");
            sb.append("\"vehicleDetails\":\"").append(escape(d.getVehicleDetails())).append("\",");
            sb.append("\"dutyStartHour\":").append(d.getDutyStartHour()).append(",");
            sb.append("\"dutyEndHour\":").append(d.getDutyEndHour()).append(",");
            sb.append("\"blocks\":[");
            List<DutyBlock> blocks = d.getBlocks();
            for (int i = 0; i < blocks.size(); i++) {
                if (i > 0) sb.append(",");
                sb.append(toJson(blocks.get(i)));
            }
            sb.append("]}");
            return sb.toString();
        }
        if (obj instanceof CampusRoute) {
            CampusRoute r = (CampusRoute) obj;
            StringBuilder sb = new StringBuilder("{");
            sb.append("\"id\":\"").append(escape(r.getId())).append("\",");
            sb.append("\"name\":\"").append(escape(r.getName())).append("\",");
            sb.append("\"code\":\"").append(escape(r.getCode())).append("\",");
            sb.append("\"estimatedMinutes\":").append(r.getEstimatedMinutes()).append(",");
            sb.append("\"distanceKm\":").append(r.getDistanceKm()).append(",");
            sb.append("\"assignedVehicle\":\"").append(escape(r.getAssignedVehicle())).append("\",");
            sb.append("\"assignedDriverId\":\"").append(escape(r.getAssignedDriverId())).append("\",");
            sb.append("\"frequency\":\"").append(escape(r.getFrequency())).append("\",");
            sb.append("\"active\":").append(r.isActive()).append(",");
            sb.append("\"stops\":[");
            for (int i = 0; i < r.getStops().size(); i++) {
                if (i > 0) sb.append(",");
                sb.append("\"").append(escape(r.getStops().get(i))).append("\"");
            }
            sb.append("]}");
            return sb.toString();
        }

        return "\"" + escape(obj.toString()) + "\"";
    }

    // Simple Recursive Descent JSON Parser
    public static Object parseJson(String json) {
        if (json == null) return null;
        json = json.trim();
        if (json.isEmpty()) return null;
        return new Parser(json).parse();
    }

    private static class Parser {
        private final String src;
        private int idx = 0;

        Parser(String src) {
            this.src = src;
        }

        private void skipWhitespace() {
            while (idx < src.length() && Character.isWhitespace(src.charAt(idx))) {
                idx++;
            }
        }

        Object parse() {
            skipWhitespace();
            if (idx >= src.length()) return null;
            char c = src.charAt(idx);
            if (c == '{') return parseObject();
            if (c == '[') return parseArray();
            if (c == '"') return parseString();
            if (c == 't' || c == 'f') return parseBoolean();
            if (c == 'n') return parseNull();
            return parseNumber();
        }

        Map<String, Object> parseObject() {
            Map<String, Object> map = new LinkedHashMap<>();
            idx++; // skip '{'
            skipWhitespace();
            if (idx < src.length() && src.charAt(idx) == '}') {
                idx++;
                return map;
            }
            while (idx < src.length()) {
                skipWhitespace();
                String key = parseString();
                skipWhitespace();
                if (idx < src.length() && src.charAt(idx) == ':') {
                    idx++;
                }
                skipWhitespace();
                Object val = parse();
                map.put(key, val);
                skipWhitespace();
                if (idx < src.length() && src.charAt(idx) == ',') {
                    idx++;
                } else if (idx < src.length() && src.charAt(idx) == '}') {
                    idx++;
                    break;
                }
            }
            return map;
        }

        List<Object> parseArray() {
            List<Object> list = new ArrayList<>();
            idx++; // skip '['
            skipWhitespace();
            if (idx < src.length() && src.charAt(idx) == ']') {
                idx++;
                return list;
            }
            while (idx < src.length()) {
                skipWhitespace();
                list.add(parse());
                skipWhitespace();
                if (idx < src.length() && src.charAt(idx) == ',') {
                    idx++;
                } else if (idx < src.length() && src.charAt(idx) == ']') {
                    idx++;
                    break;
                }
            }
            return list;
        }

        String parseString() {
            skipWhitespace();
            if (idx >= src.length() || src.charAt(idx) != '"') return "";
            idx++; // skip '"'
            StringBuilder sb = new StringBuilder();
            while (idx < src.length()) {
                char c = src.charAt(idx++);
                if (c == '"') break;
                if (c == '\\' && idx < src.length()) {
                    char esc = src.charAt(idx++);
                    switch (esc) {
                        case '"': sb.append('"'); break;
                        case '\\': sb.append('\\'); break;
                        case '/': sb.append('/'); break;
                        case 'b': sb.append('\b'); break;
                        case 'f': sb.append('\f'); break;
                        case 'n': sb.append('\n'); break;
                        case 'r': sb.append('\r'); break;
                        case 't': sb.append('\t'); break;
                        case 'u':
                            if (idx + 4 <= src.length()) {
                                String hex = src.substring(idx, idx + 4);
                                idx += 4;
                                sb.append((char) Integer.parseInt(hex, 16));
                            }
                            break;
                        default: sb.append(esc);
                    }
                } else {
                    sb.append(c);
                }
            }
            return sb.toString();
        }

        Boolean parseBoolean() {
            if (src.startsWith("true", idx)) {
                idx += 4;
                return Boolean.TRUE;
            }
            if (src.startsWith("false", idx)) {
                idx += 5;
                return Boolean.FALSE;
            }
            return Boolean.FALSE;
        }

        Object parseNull() {
            if (src.startsWith("null", idx)) {
                idx += 4;
            }
            return null;
        }

        Number parseNumber() {
            int start = idx;
            if (idx < src.length() && (src.charAt(idx) == '-' || src.charAt(idx) == '+')) {
                idx++;
            }
            boolean isDouble = false;
            while (idx < src.length()) {
                char c = src.charAt(idx);
                if (Character.isDigit(c)) {
                    idx++;
                } else if (c == '.' || c == 'e' || c == 'E') {
                    isDouble = true;
                    idx++;
                } else {
                    break;
                }
            }
            String numStr = src.substring(start, idx);
            try {
                if (isDouble) return Double.parseDouble(numStr);
                return Long.parseLong(numStr);
            } catch (Exception e) {
                return 0;
            }
        }
    }
}
