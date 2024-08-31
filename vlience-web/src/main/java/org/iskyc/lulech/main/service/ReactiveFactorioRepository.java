package org.iskyc.lulech.main.service;

import org.iskyc.lulech.main.service.dao.FactorioItems;
import org.springframework.data.elasticsearch.repository.ReactiveElasticsearchRepository;
import reactor.core.publisher.Flux;

import java.util.List;

public interface ReactiveFactorioRepository extends ReactiveElasticsearchRepository<FactorioItems, String> {

}
