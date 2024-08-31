package org.iskyc.lulech.main.service.dao;


import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;
import org.springframework.stereotype.Component;

@Component
public class FactorioCostItem {

    @Field(type = FieldType.Double)
    private Double costs;

    @Field(type = FieldType.Text)
    private String costItemId;

    public Double getCosts() {
        return costs;
    }

    public void setCosts(Double costs) {
        this.costs = costs;
    }

    public String getCostItemId() {
        return costItemId;
    }

    public void setCostItemId(String costItemId) {
        this.costItemId = costItemId;
    }

    @Override
    public String toString() {
        return "FactorioCostItem{" +
                "costs=" + costs +
                ", costItemId='" + costItemId + '\'' +
                '}';
    }
}
