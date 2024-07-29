package org.example;

public class QueryExecutor<T> {
    private final CustomDatabase<String, T> database;

    public QueryExecutor(CustomDatabase<String, T> database) {
        this.database = database;
    }

    public Object execute(Query<T> query) {
        switch (query.getOperation()) {
            case "insert":
                database.put(query.getKey(), query.getValue());
                System.out.println("Inserted (" + query.getKey() + ", " + query.getValue() + ")");
                return "Inserted (" + query.getKey() + ", " + query.getValue() + ")";
            case "read":
                T value = database.get(query.getKey());
                System.out.println("Read (" + query.getKey() + ", " + value + ")");
                return value;
            case "delete":
                database.remove(query.getKey());
                System.out.println("Deleted (" + query.getKey() + ")");
                return "Deleted (" + query.getKey() + ")";
            case "update":
                database.put(query.getKey(), query.getValue());
                System.out.println("Updated (" + query.getKey() + ", " + query.getValue() + ")");
                return "Updated (" + query.getKey() + ", " + query.getValue() + ")";
            default:
                System.out.println("Invalid query operation");
                throw new IllegalArgumentException("Invalid query operation: " + query.getOperation());
        }
    }
}
