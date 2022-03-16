package fi.vm.sade.koodisto.config.properties;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "cas")
public class CasProperties {
    @Getter
    @Setter
    private String service;
    @Getter
    @Setter
    private Boolean sendRenew;
    @Getter
    @Setter
    private String key;
    @Getter
    @Setter
    private String base;
    @Getter
    @Setter
    private String login;
}
