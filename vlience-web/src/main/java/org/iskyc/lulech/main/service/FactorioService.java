package org.iskyc.lulech.main.service;

import org.iskyc.lulech.main.service.dao.FactorioItems;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.elasticsearch.core.ReactiveElasticsearchOperations;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.List;

@Component
public class FactorioService {

    @Autowired
    private ReactiveFactorioRepository repository;

    @Autowired
    ReactiveElasticsearchOperations operations;

    public Flux<FactorioItems> findAll() {
        return repository.findAll();
    }

    public Flux<FactorioItems> findById(String id) {
        return repository.findById(id).flux();
    }

    public boolean save(FactorioItems items) { return operations.save(items).subscribe().isDisposed(); }

    public Flux<FactorioItems> saves(List<FactorioItems> items) {
        return operations.saveAll(Mono.just(items), FactorioItems.class);
    }
}
