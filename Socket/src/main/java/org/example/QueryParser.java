package org.example;

import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class QueryParser {
    private static final Pattern INSERT_PATTERN = Pattern.compile("\\{\\s*\"operation\"\\s*:\\s*\"insert\"\\s*,\\s*\"key\"\\s*:\\s*\"([^\"]+)\"\\s*,\\s*\"value\"\\s*:\\s*(\".*\"|\\{.*\\}|\\[.*\\])\\s*\\}");
    private static final Pattern READ_PATTERN = Pattern.compile("\\{\\s*\"operation\"\\s*:\\s*\"read\"\\s*,\\s*\"key\"\\s*:\\s*\"([^\"]+)\"\\s*\\}");
    private static final Pattern UPDATE_PATTERN = Pattern.compile("\\{\\s*\"operation\"\\s*:\\s*\"update\"\\s*,\\s*\"key\"\\s*:\\s*\"([^\"]+)\"\\s*,\\s*\"value\"\\s*:\\s*(\".*\"|\\{.*\\}|\\[.*\\])\\s*\\}");
    private static final Pattern DELETE_PATTERN = Pattern.compile("\\{\\s*\"operation\"\\s*:\\s*\"delete\"\\s*,\\s*\"key\"\\s*:\\s*\"([^\"]+)\"\\s*\\}");

    public static Query<?> parse(String json) throws IOException {
        Matcher matcher;

        matcher = INSERT_PATTERN.matcher(json);
        if (matcher.matches()) {
            String key = matcher.group(1);
            String value = matcher.group(2);
            ObjectMapper mapper = new ObjectMapper();
            Object valueObject = parseValue(value);
            return new Query<>("insert", key, valueObject);
        }

        matcher = READ_PATTERN.matcher(json);
        if (matcher.matches()) {
            String key = matcher.group(1);
            return new Query<>("read", key, null);
        }

        matcher = UPDATE_PATTERN.matcher(json);
        if (matcher.matches()) {
            String key = matcher.group(1);
            String value = matcher.group(2);
            ObjectMapper mapper = new ObjectMapper();
            Object valueObject = parseValue(value);
            return new Query<>("update", key, valueObject);
        }

        matcher = DELETE_PATTERN.matcher(json);
        if (matcher.matches()) {
            String key = matcher.group(1);
            return new Query<>("delete", key, null);
        }

        throw new IllegalArgumentException("Invalid query format: " + json);
    }

    private static Object parseValue(String value) throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        if (value.startsWith("\"")) {
            return value.substring(1, value.length() - 1); // Remove quotes for simple strings
        } else if (value.startsWith("{")) {
            return mapper.readValue(value, Map.class); // Parse JSON object
        } else if (value.startsWith("[")) {
            return mapper.readValue(value, List.class); // Parse JSON array
        } else {
            throw new IllegalArgumentException("Unexpected value format: " + value);
        }
    }
}

