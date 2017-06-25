/*
 * Copyright 2016 the original author or authors.
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

package com.smart.learning.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.web.cors.CorsConfiguration;

/**
 * Properties specific to Application.
 * <p>
 * <p>
 * Properties are configured in the application.yml file.
 * </p>
 */
@ConfigurationProperties(prefix = "application", ignoreUnknownFields = false)
public class AppProperties {

    private final Async async = new Async();

    private final Cache cache = new Cache();

    private final CorsConfiguration cors = new CorsConfiguration();

    private final Http http = new Http();

    private final Logging logging = new Logging();

    private final Mail mail = new Mail();

    private final Metrics metrics = new Metrics();

    private final Security security = new Security();

    private final Swagger swagger = new Swagger();

    public Async getAsync() {
        return async;
    }

    public Cache getCache() {
        return cache;
    }

    public CorsConfiguration getCors() {
        return cors;
    }

    public Http getHttp() {
        return http;
    }

    public Logging getLogging() {
        return logging;
    }

    public Mail getMail() {
        return mail;
    }

    public Metrics getMetrics() {
        return metrics;
    }

    public Security getSecurity() {
        return security;
    }

    public Swagger getSwagger() {
        return swagger;
    }

    public static class Async {

        private int corePoolSize = 2;

        private int maxPoolSize = 50;

        private int queueCapacity = 10000;

        public int getCorePoolSize() {
            return corePoolSize;
        }

        public void setCorePoolSize(int corePoolSize) {
            this.corePoolSize = corePoolSize;
        }

        public int getMaxPoolSize() {
            return maxPoolSize;
        }

        public void setMaxPoolSize(int maxPoolSize) {
            this.maxPoolSize = maxPoolSize;
        }

        public int getQueueCapacity() {
            return queueCapacity;
        }

        public void setQueueCapacity(int queueCapacity) {
            this.queueCapacity = queueCapacity;
        }
    }

    public static class Cache {

        private final Ehcache ehcache = new Ehcache();

        private final Hazelcast hazelcast = new Hazelcast();

        private final Infinispan infinispan = new Infinispan();

        public Ehcache getEhcache() {
            return ehcache;
        }

        public Hazelcast getHazelcast() {
            return hazelcast;
        }

        public Infinispan getInfinispan() {
            return infinispan;
        }

        public static class Ehcache {

            private long maxEntries = 100;

            private int timeToLiveSeconds = 3600;

            public long getMaxEntries() {
                return maxEntries;
            }

            public void setMaxEntries(long maxEntries) {
                this.maxEntries = maxEntries;
            }

            public int getTimeToLiveSeconds() {
                return timeToLiveSeconds;
            }

            public void setTimeToLiveSeconds(int timeToLiveSeconds) {
                this.timeToLiveSeconds = timeToLiveSeconds;
            }
        }

        public static class Hazelcast {

            private int backupCount = 1;

            private int timeToLiveSeconds = 3600;

            public int getBackupCount() {
                return backupCount;
            }

            public void setBackupCount(int backupCount) {
                this.backupCount = backupCount;
            }

            public int getTimeToLiveSeconds() {
                return timeToLiveSeconds;
            }

            public void setTimeToLiveSeconds(int timeToLiveSeconds) {
                this.timeToLiveSeconds = timeToLiveSeconds;
            }
        }

        public static class Infinispan {

            private final Distributed distributed = new Distributed();

            private final Local local = new Local();

            private final Replicated replicated = new Replicated();

            private String configFile = "default-configs/default-jgroups-tcp.xml";

            private boolean statsEnabled;

            public String getConfigFile() {
                return configFile;
            }

            public void setConfigFile(String configFile) {
                this.configFile = configFile;
            }

            public Distributed getDistributed() {
                return distributed;
            }

            public Local getLocal() {
                return local;
            }

            public Replicated getReplicated() {
                return replicated;
            }

            public boolean isStatsEnabled() {
                return statsEnabled;
            }

            public void setStatsEnabled(boolean statsEnabled) {
                this.statsEnabled = statsEnabled;
            }

            public static class Distributed {

                private int instanceCount = 1;

                private long maxEntries = 100;

                private long timeToLiveSeconds = 60;

                public int getInstanceCount() {
                    return instanceCount;
                }

                public void setInstanceCount(int instanceCount) {
                    this.instanceCount = instanceCount;
                }

                public long getMaxEntries() {
                    return maxEntries;
                }

                public void setMaxEntries(long maxEntries) {
                    this.maxEntries = maxEntries;
                }

                public long getTimeToLiveSeconds() {
                    return timeToLiveSeconds;
                }

                public void setTimeToLiveSeconds(long timeToLiveSeconds) {
                    this.timeToLiveSeconds = timeToLiveSeconds;
                }
            }

            public static class Local {

                private long maxEntries = 100;

                private long timeToLiveSeconds = 60;

                public long getMaxEntries() {
                    return maxEntries;
                }

                public void setMaxEntries(long maxEntries) {
                    this.maxEntries = maxEntries;
                }

                public long getTimeToLiveSeconds() {
                    return timeToLiveSeconds;
                }

                public void setTimeToLiveSeconds(long timeToLiveSeconds) {
                    this.timeToLiveSeconds = timeToLiveSeconds;
                }

            }

            public static class Replicated {

                private long maxEntries = 100;

                private long timeToLiveSeconds = 60;

                public long getMaxEntries() {
                    return maxEntries;
                }

                public void setMaxEntries(long maxEntries) {
                    this.maxEntries = maxEntries;
                }

                public long getTimeToLiveSeconds() {
                    return timeToLiveSeconds;
                }

                public void setTimeToLiveSeconds(long timeToLiveSeconds) {
                    this.timeToLiveSeconds = timeToLiveSeconds;
                }

            }
        }
    }

    public static class Http {

        private final Cache cache = new Cache();

        /**
         * HTTP version, must be "V_1_1" (for HTTP/1.1) or V_2_0 (for (HTTP/2)
         */
        private Version version = Version.V_1_1;

        public Cache getCache() {
            return cache;
        }

        public Version getVersion() {
            return version;
        }

        public Http setVersion(Version version) {
            this.version = version;
            return this;
        }

        public enum Version {V_1_1, V_2_0}

        public static class Cache {

            private int timeToLiveInDays = 1461;

            public int getTimeToLiveInDays() {
                return timeToLiveInDays;
            }

            public void setTimeToLiveInDays(int timeToLiveInDays) {
                this.timeToLiveInDays = timeToLiveInDays;
            }
        }
    }

    public static class Logging {

        private final Logstash logstash = new Logstash();

        private final SpectatorMetrics spectatorMetrics = new SpectatorMetrics();

        public Logstash getLogstash() {
            return logstash;
        }

        public SpectatorMetrics getSpectatorMetrics() {
            return spectatorMetrics;
        }

        public static class Logstash {

            private boolean enabled = false;

            private String host = "localhost";

            private int port = 5000;

            private int queueSize = 512;

            public String getHost() {
                return host;
            }

            public void setHost(String host) {
                this.host = host;
            }

            public int getPort() {
                return port;
            }

            public void setPort(int port) {
                this.port = port;
            }

            public int getQueueSize() {
                return queueSize;
            }

            public void setQueueSize(int queueSize) {
                this.queueSize = queueSize;
            }

            public boolean isEnabled() {
                return enabled;
            }

            public void setEnabled(boolean enabled) {
                this.enabled = enabled;
            }
        }

        public static class SpectatorMetrics {

            private boolean enabled = false;

            public boolean isEnabled() {
                return enabled;
            }

            public void setEnabled(boolean enabled) {
                this.enabled = enabled;
            }
        }
    }

    public static class Mail {

        private String baseUrl = "";

        private String from = "";

        public String getBaseUrl() {
            return baseUrl;
        }

        public void setBaseUrl(String baseUrl) {
            this.baseUrl = baseUrl;
        }

        public String getFrom() {
            return from;
        }

        public void setFrom(String from) {
            this.from = from;
        }
    }

    public static class Metrics {

        private final Graphite graphite = new Graphite();

        private final Jmx jmx = new Jmx();

        private final Logs logs = new Logs();

        private final Prometheus prometheus = new Prometheus();

        public Graphite getGraphite() {
            return graphite;
        }

        public Jmx getJmx() {
            return jmx;
        }

        public Logs getLogs() {
            return logs;
        }

        public Prometheus getPrometheus() {
            return prometheus;
        }

        public static class Graphite {

            private boolean enabled = false;

            private String host = "localhost";

            private int port = 2003;

            private String prefix = "jhipsterApplication";

            public String getHost() {
                return host;
            }

            public void setHost(String host) {
                this.host = host;
            }

            public int getPort() {
                return port;
            }

            public void setPort(int port) {
                this.port = port;
            }

            public String getPrefix() {
                return prefix;
            }

            public void setPrefix(String prefix) {
                this.prefix = prefix;
            }

            public boolean isEnabled() {
                return enabled;
            }

            public void setEnabled(boolean enabled) {
                this.enabled = enabled;
            }
        }

        public static class Jmx {

            private boolean enabled = true;

            public boolean isEnabled() {
                return enabled;
            }

            public void setEnabled(boolean enabled) {
                this.enabled = enabled;
            }
        }

        public static class Logs {

            private boolean enabled = false;

            private long reportFrequency = 60;

            public long getReportFrequency() {
                return reportFrequency;
            }

            public void setReportFrequency(int reportFrequency) {
                this.reportFrequency = reportFrequency;
            }

            public boolean isEnabled() {
                return enabled;
            }

            public void setEnabled(boolean enabled) {
                this.enabled = enabled;
            }
        }

        public static class Prometheus {

            private boolean enabled = false;

            private String endpoint = "/prometheusMetrics";

            public String getEndpoint() {
                return endpoint;
            }

            public void setEndpoint(String endpoint) {
                this.endpoint = endpoint;
            }

            public boolean isEnabled() {
                return enabled;
            }

            public void setEnabled(boolean enabled) {
                this.enabled = enabled;
            }
        }
    }

    public static class Security {

        private final Authentication authentication = new Authentication();

        public Authentication getAuthentication() {
            return authentication;
        }

        public static class Authentication {

            private final Jwt jwt = new Jwt();

            public Jwt getJwt() {
                return jwt;
            }

            public static class Jwt {

                private String secret;

                private long tokenValidityInSeconds = 1800;

                private long tokenValidityInSecondsForRememberMe = 2592000;

                public String getSecret() {
                    return secret;
                }

                public Jwt setSecret(String secret) {
                    this.secret = secret;
                    return this;
                }

                public long getTokenValidityInSeconds() {
                    return tokenValidityInSeconds;
                }

                public Jwt setTokenValidityInSeconds(long tokenValidityInSeconds) {
                    this.tokenValidityInSeconds = tokenValidityInSeconds;
                    return this;
                }

                public long getTokenValidityInSecondsForRememberMe() {
                    return tokenValidityInSecondsForRememberMe;
                }

                public Jwt setTokenValidityInSecondsForRememberMe(long tokenValidityInSecondsForRememberMe) {
                    this.tokenValidityInSecondsForRememberMe = tokenValidityInSecondsForRememberMe;
                    return this;
                }
            }
        }
    }

    public static class Swagger {

        private String contactEmail;

        private String contactName;

        private String contactUrl;

        private String defaultIncludePattern = "/api/.*";

        private String description = "API documentation";

        private String license;

        private String licenseUrl;

        private String termsOfServiceUrl;

        private String title = "Application API";

        private String version = "0.0.1";

        public String getContactEmail() {
            return contactEmail;
        }

        public Swagger setContactEmail(String contactEmail) {
            this.contactEmail = contactEmail;
            return this;
        }

        public String getContactName() {
            return contactName;
        }

        public Swagger setContactName(String contactName) {
            this.contactName = contactName;
            return this;
        }

        public String getContactUrl() {
            return contactUrl;
        }

        public Swagger setContactUrl(String contactUrl) {
            this.contactUrl = contactUrl;
            return this;
        }

        public String getDefaultIncludePattern() {
            return defaultIncludePattern;
        }

        public Swagger setDefaultIncludePattern(String defaultIncludePattern) {
            this.defaultIncludePattern = defaultIncludePattern;
            return this;
        }

        public String getDescription() {
            return description;
        }

        public Swagger setDescription(String description) {
            this.description = description;
            return this;
        }

        public String getLicense() {
            return license;
        }

        public Swagger setLicense(String license) {
            this.license = license;
            return this;
        }

        public String getLicenseUrl() {
            return licenseUrl;
        }

        public Swagger setLicenseUrl(String licenseUrl) {
            this.licenseUrl = licenseUrl;
            return this;
        }

        public String getTermsOfServiceUrl() {
            return termsOfServiceUrl;
        }

        public Swagger setTermsOfServiceUrl(String termsOfServiceUrl) {
            this.termsOfServiceUrl = termsOfServiceUrl;
            return this;
        }

        public String getTitle() {
            return title;
        }

        public Swagger setTitle(String title) {
            this.title = title;
            return this;
        }

        public String getVersion() {
            return version;
        }

        public Swagger setVersion(String version) {
            this.version = version;
            return this;
        }
    }
}
