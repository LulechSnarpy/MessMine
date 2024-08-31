package org.iskyc.lulech.main.service.dao;

import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

import java.util.ArrayList;
import java.util.List;

@Document(indexName = "factorio")
public class FactorioItems {
    @Id
    private  String id;

    @Field(type = FieldType.Text)
    private String name;

    @Field(type = FieldType.Text)
    private String description;

    @Field(type = FieldType.Double)
    private Double costTimes;

    @Field(type = FieldType.Nested)
    private List<FactorioCostItem> costs;

    @Field(type = FieldType.Text)
    private List<String> Consumed;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Double getCostTimes() {
        return costTimes;
    }

    public void setCostTimes(Double costTimes) {
        this.costTimes = costTimes;
    }

    public List<FactorioCostItem> getCosts() {
        return costs;
    }

    public void setCosts(List<FactorioCostItem> costs) {
        this.costs = costs;
    }

    public List<String> getConsumed() {
        return Consumed;
    }

    public void setConsumed(List<String> consumed) {
        Consumed = consumed;
    }

    @Override
    public String toString() {
        return "FactorioItems{" +
                "id='" + id + '\'' +
                ", name='" + name + '\'' +
                ", description='" + description + '\'' +
                ", costTimes=" + costTimes +
                ", costs=" + costs +
                ", Consumed=" + Consumed +
                '}';
    }
}
