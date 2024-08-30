package org.iskyc.lulech.main.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectWriter;
import org.iskyc.lulech.main.service.dao.FactorioCostItem;
import org.iskyc.lulech.main.service.dao.FactorioItems;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.*;

@RestController
public class FactorioController {
    private final static String baseUrl= "https://wiki.factorio.com";
    private final static String prefix = "/";
    List<FactorioItems> items;
    Set<String> currentItems;
    @RequestMapping("/getDataFormFactorio")
    @ResponseBody
    public String getDataFormFactorio() throws IOException, InterruptedException {
        items = new ArrayList<>();
        currentItems = new HashSet<>();
        getItemsByUrl("/Production_science_pack");
        ObjectWriter ow =  new ObjectMapper().writer().withDefaultPrettyPrinter();
        return ow.writeValueAsString(items);
    }

    public Document getDoucmentByUrl(String baseurl, String url) throws IOException, InterruptedException {
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(baseUrl + url))
                .build();
        HttpClient client = HttpClient.newBuilder()
                .build();
        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
        return Jsoup.parse(response.body());
    }

    public void getItemsByUrl(String url) throws IOException, InterruptedException {
        Document document = getDoucmentByUrl(baseUrl, url);
        Elements elements;
        Element element;
        List<FactorioItems> preItems;
        Set<String> nextItems;
        List<Double> costs;
        FactorioCostItem cost;
        List<FactorioCostItem> costItems;
        nextItems = new HashSet<>();
        FactorioItems item = new FactorioItems();
        String name;
        String description;
        // init item
        item.setId(urlToId(url));
        name = document.select("td.infobox-header-text").select("span").text();
        item.setName(name);
        description = baseUrl + document.select("td.infobox-header-text")
                .prev().select("img").attr("src");
        item.setDescription(description);
        // Found Founder
        elements = document.select("tr.border-top:contains(Recipe)");
        if (!elements.isEmpty()) {
            element = elements.getFirst().nextElementSibling();
            if (null != element) {
                preItems = element.select("a")
                        .stream().map(this::getItemByElement).toList();
                if (!preItems.isEmpty()) {
                    costs = element.select("div.factorio-icon-text")
                            .stream().map(x->{
                                String s = x.text();
                                int k = s.indexOf("k");
                                if (k < 0) return s;
                                s = s.replaceAll("k", "");
                                k = s.indexOf(".");
                                if (k < 0) return s + "000";
                                k =  s.length() - k - 1;
                                s = s + "000".substring(k);
                                k = s.indexOf(".");
                                return  s.substring(0, k) + s.substring(k + 1);
                            }).map(Double::parseDouble).toList();
                    Double baseCost = costs.getLast();
                    item.setCostTimes(costs.getFirst() / baseCost);
                    costItems = new ArrayList<>();
                    for (int i = 1; i < preItems.size() - 1; i++) {
                        cost = new FactorioCostItem();
                        cost.setCosts(costs.get(i) / baseCost);
                        cost.setCostItemId(preItems.get(i).getId());
                        costItems.add(cost);
                        nextItems.add(idToUrl(preItems.get(i).getId()));
                    }
                    item.setCosts(costItems);
                }
            }
        }
        // Found Consumer
        elements = document.select("tr.border-top:contains(Consumed by)");
        if (!elements.isEmpty()) {
            element = elements.getFirst().nextElementSibling();
            if (null != element) {
                preItems = element.select("a")
                        .stream().map(this::getItemByElement).toList();
                if (!preItems.isEmpty()) {
                    item.setUsed(preItems.stream().map(FactorioItems::getId).toList());
                    nextItems.addAll(item.getUsed().stream().map(this::idToUrl).toList());
                }
            }
        }
        // add item
        items.add(item);
        // found next items
        nextItems.removeAll(currentItems);
        currentItems.addAll(nextItems);
        for (String nextUrl : nextItems) {
            getItemsByUrl(nextUrl);
        }
    }

    public String urlToId (String url) {
        return url.substring(1);
    }

    public String idToUrl (String id) {
        return prefix + id;
    }

    public FactorioItems getItemByElement(Element element) {
        String href = element.attr("href");
        String title = element.attr("title");
        FactorioItems item = new FactorioItems();
        item.setName(title);
        item.setId(urlToId(href));
        return item;
    }

     /*   public void itemsAddAll(List<FactorioItems> data) {
            for(FactorioItems item : data) {
                items.put(item.getId(), item);
            }
        }*/
}
