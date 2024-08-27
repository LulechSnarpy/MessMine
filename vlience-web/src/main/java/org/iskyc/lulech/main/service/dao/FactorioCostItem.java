package org.iskyc.lulech.main.service.dao;


import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;
import org.springframework.stereotype.Component;

@Component
public class FactorioCostItem {

    @Field(type = FieldType.Integer)
    private Integer costs;

    @Field(type = FieldType.Object)
    private FactorioItems costItem;

    public Integer getCosts() {
        return costs;
    }

    public void setCosts(Integer costs) {
        this.costs = costs;
    }

    public FactorioItems getCostItem() {
        return costItem;
    }

    public void setCostItem(FactorioItems costItem) {
        this.costItem = costItem;
    }
}
