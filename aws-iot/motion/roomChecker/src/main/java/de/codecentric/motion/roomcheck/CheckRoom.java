package de.codecentric.motion.roomcheck;


import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;

import java.util.Map;

public class CheckRoom implements RequestHandler<Map<String, Object>, String> {

    @Override
    public String handleRequest(Map<String, Object> input, Context context) {
        context.getLogger().log("Input: " + input);
        String output = "Hello, " + input + "!";
        return output;
    }

}
