package com.smart.learning.config.apidoc;

import com.smart.learning.config.Constants;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;
import springfox.documentation.swagger.web.SwaggerResource;
import springfox.documentation.swagger.web.SwaggerResourcesProvider;

import java.util.ArrayList;
import java.util.List;

@Component
@Primary
@Profile(Constants.Profile.SPRING_PROFILE_DEVELOPMENT)
public class AppSwaggerResourcesProvider implements SwaggerResourcesProvider {

    @Override
    public List<SwaggerResource> get() {
        List<SwaggerResource> resources = new ArrayList<>();

        //Add the default swagger resource that correspond to the gateway's own swagger doc
        SwaggerResource swaggerResource = new SwaggerResource();
        swaggerResource.setName("default");
        swaggerResource.setLocation("/v2/api-docs");
        swaggerResource.setSwaggerVersion("2.0");
        resources.add(swaggerResource);

        return resources;
    }
}
