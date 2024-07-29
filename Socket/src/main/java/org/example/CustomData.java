package org.example;

import java.util.List;
import java.util.Map;

public class CustomData {
    private String name;
    private int value;
    private List<CustomData> nestedList;
    private Map<String, CustomData> nestedMap;

    public CustomData() { }

    public CustomData(String name, int value, List<CustomData> nestedList, Map<String, CustomData> nestedMap) {
        this.name = name;
        this.value = value;
        this.nestedList = nestedList;
        this.nestedMap = nestedMap;
    }

    // Getters and setters

    @Override
    public String toString() {
        return "CustomData{name='" + name + "', value=" + value + ", nestedList=" + nestedList + ", nestedMap=" + nestedMap + '}';
    }
}
