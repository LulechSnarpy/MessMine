package org.iskyc.lulech.main.service;

import org.iskyc.lulech.main.service.dao.FactorioItems;
import org.springframework.data.repository.reactive.ReactiveSortingRepository;

import java.util.List;

public interface ReactiveFactorioRepository extends ReactiveSortingRepository<FactorioItems, String> {

    List<FactorioItems> findByName(String name);

    List<FactorioItems> findById(String id);

    List<FactorioItems> findByUsedBy(List<String> usedBy);

    FactorioItems save(FactorioItems items);

    FactorioItems saveAndFlush(FactorioItems items);
}
