package org.iskyc.lulech.main.service.database;

import org.springframework.context.annotation.*;
import org.springframework.data.elasticsearch.client.ClientConfiguration;
import org.springframework.data.elasticsearch.client.elc.ElasticsearchConfiguration;
import org.springframework.data.elasticsearch.repository.config.EnableElasticsearchRepositories;

@Configuration
@EnableElasticsearchRepositories(basePackages
        = "org.iskyc.lulech.main.service")
@ComponentScan(basePackages = { "org.iskyc.lulech.main.service" })
public class ElasticsearchConfig extends ElasticsearchConfiguration {

    private final static String url = "localhost:9200";

    @Override
    public ClientConfiguration clientConfiguration() {
        return ClientConfiguration.builder().connectedTo(url).build();
    }

}
