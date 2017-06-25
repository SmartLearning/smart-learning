/*
 * Copyright 2016-2017 the original author or authors from the JHipster project.
 *
 * This file is part of the JHipster project, see https://jhipster.github.io/
 * for more information.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package com.smart.learning.config.metrics;

import com.codahale.metrics.MetricRegistry;
import com.smart.learning.config.AppProperties;
import io.prometheus.client.CollectorRegistry;
import io.prometheus.client.dropwizard.DropwizardExports;
import io.prometheus.client.exporter.MetricsServlet;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.condition.ConditionalOnClass;
import org.springframework.boot.web.servlet.ServletContextInitializer;
import org.springframework.context.annotation.Configuration;

import javax.servlet.ServletContext;
import javax.servlet.ServletException;

@Configuration
@ConditionalOnClass(CollectorRegistry.class)
public class PrometheusRegistry implements ServletContextInitializer {

    private final Logger log = LoggerFactory.getLogger(PrometheusRegistry.class);

    private final MetricRegistry metricRegistry;

    private final AppProperties properties;

    public PrometheusRegistry(MetricRegistry metricRegistry, AppProperties properties) {
        this.metricRegistry = metricRegistry;
        this.properties = properties;
    }

    @Override
    public void onStartup(ServletContext servletContext) throws ServletException {
        if (properties.getMetrics().getPrometheus().isEnabled()) {
            String endpoint = properties.getMetrics().getPrometheus().getEndpoint();
            log.info("Initializing Metrics Prometheus endpoint at {}", endpoint);
            CollectorRegistry collectorRegistry = new CollectorRegistry();
            collectorRegistry.register(new DropwizardExports(metricRegistry));
            servletContext
                .addServlet("prometheusMetrics", new MetricsServlet(collectorRegistry))
                .addMapping(endpoint);
        }
    }
}
