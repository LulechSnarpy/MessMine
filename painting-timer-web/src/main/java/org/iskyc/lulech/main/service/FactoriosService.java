package org.iskyc.lulech.main.service;

import org.iskyc.lulech.main.service.dao.FactorioItems;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class FactoriosService {

    @Autowired
    private ReactiveFactorioRepository repository;

    List<FactorioItems> findByName(String name) {
        return repository.findByName(name);
    }

}
