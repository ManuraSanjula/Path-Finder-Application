package org.NIBM.Web;

import org.NIBM.DS.CustomHashMap;
import org.NIBM.DTO.LocationDetails;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@WebServlet("/*")
public class WebClass extends HttpServlet {
    CustomHashMap<String, String> user_creds =  new CustomHashMap<>();
    CustomHashMap<String, CustomHashMap<String, LocationDetails>> user_details =  new CustomHashMap<>();
    CustomHashMap<String, String> user_tokens =  new CustomHashMap<>();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String pathInfo = request.getPathInfo();

        if (pathInfo != null && !pathInfo.equals("/")) {
            String[] pathParts = pathInfo.split("/");
            for (String part : pathParts) {
                if(!part.isEmpty())
                    response.getWriter().println("Path part: " + part);
            }
        } else {
            response.getWriter().println("No path info available");
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        doGet(request, response);
    }
}
