package org.example;

import javax.crypto.SecretKey;
import java.io.*;
import java.net.ServerSocket;
import java.net.Socket;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class Main {
    public static CustomDatabase<String, CustomData> db = null;
    public static QueryExecutor<CustomData> executor = null;
    static {
        try {
            SecretKey secretKey;
            File keyFile = new File("keyfile");

            if (!keyFile.exists()) {
                secretKey = EncryptionUtil.generateKey();
                KeyManagement.saveKey(secretKey, "keyfile");
            } else {
                secretKey = KeyManagement.loadKey("keyfile");
            }

            db = new CustomDatabase<>("database.db", secretKey);    //db.put("key12", "value1");
            executor = new QueryExecutor<>(db);

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    private static final int PORT = 8080;
    private static final int THREAD_POOL_SIZE = 10;
    private static final ExecutorService threadPool = Executors.newFixedThreadPool(THREAD_POOL_SIZE);

    public static void main(String[] args) {
        try (ServerSocket serverSocket = new ServerSocket(PORT)) {
            System.out.println("Server started on port " + PORT);

            while (true) {
                Socket clientSocket = serverSocket.accept();
                threadPool.execute(new ClientHandler(clientSocket));
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
 class ClientHandler implements Runnable {
    private Socket clientSocket;

    public ClientHandler(Socket socket) {
        this.clientSocket = socket;
    }

    public void SQL(StringBuilder body, PrintWriter out) throws IOException {
        try{
            Object ob = Main.executor.execute((Query<CustomData>) QueryParser.parse(body.toString()));
            out.println(ob);
        }catch (Exception e){
            e.printStackTrace();
            out.println(false);
        }
    }

    @Override
    public void run() {
        try (BufferedReader in = new BufferedReader(new InputStreamReader(clientSocket.getInputStream()));
             PrintWriter out = new PrintWriter(clientSocket.getOutputStream(), true)) {

            String line;
            StringBuilder requestBuilder = new StringBuilder();
            while (!(line = in.readLine()).isBlank()) {
                requestBuilder.append(line).append("\r\n");
            }

            String request = requestBuilder.toString();
            System.out.println("Received request: \n" + request);

            String method = request.split(" ")[0];
            String path = request.split(" ")[1];

            // Handle CORS preflight request
            if ("OPTIONS".equalsIgnoreCase(method)) {
                handleCors(out);
            } else {
                switch (method) {
                    case "GET":
                        handleGet(out, path);
                        break;
                    case "POST":
                        handlePost(in, out, path);
                        break;
                    case "PUT":
                        handlePut(in, out, path);
                        break;
                    case "PATCH":
                        handlePatch(in, out, path);
                        break;
                    default:
                        out.println("HTTP/1.1 405 Method Not Allowed");
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private void handleCors(PrintWriter out) {
        out.println("HTTP/1.1 204 No Content");
        out.println("Access-Control-Allow-Origin: *");
        out.println("Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS");
        out.println("Access-Control-Allow-Headers: Content-Type");
        out.println();
    }

    private void handleGet(PrintWriter out, String path) {
        out.println("HTTP/1.1 200 OK");
        out.println("Access-Control-Allow-Origin: *");
        out.println("Content-Type: text/plain");
        out.println();
        out.println("GET request received for path: " + path);
    }

    private void handlePost(BufferedReader in, PrintWriter out, String path) throws IOException {
        StringBuilder body = new StringBuilder();
        while (in.ready()) {
            body.append((char) in.read());
        }
        out.println("HTTP/1.1 200 OK");
        out.println("Access-Control-Allow-Origin: *");
        out.println("Content-Type: text/plain");
        out.println();
        SQL(body,out);
    }

    private void handlePut(BufferedReader in, PrintWriter out, String path) throws IOException {
        StringBuilder body = new StringBuilder();
        while (in.ready()) {
            body.append((char) in.read());
        }
        out.println("HTTP/1.1 200 OK");
        out.println("Access-Control-Allow-Origin: *");
        out.println("Content-Type: text/plain");
        out.println();
        out.println("PUT request received for path: " + path);
        SQL(body,out);
    }

    private void handlePatch(BufferedReader in, PrintWriter out, String path) throws IOException {
        StringBuilder body = new StringBuilder();
        while (in.ready()) {
            body.append((char) in.read());
        }
        out.println("HTTP/1.1 200 OK");
        out.println("Access-Control-Allow-Origin: *");
        out.println("Content-Type: text/plain");
        out.println();
        out.println("PATCH request received for path: " + path);
        SQL(body,out);
    }
}


