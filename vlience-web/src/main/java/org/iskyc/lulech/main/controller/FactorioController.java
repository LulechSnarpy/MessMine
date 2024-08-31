package org.iskyc.lulech.main.controller;

import co.elastic.clients.json.jackson.JacksonJsonpParser;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectWriter;
import org.iskyc.lulech.main.service.FactorioService;
import org.iskyc.lulech.main.service.dao.FactorioCostItem;
import org.iskyc.lulech.main.service.dao.FactorioItems;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Flux;

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
    private final static List<String> banList = Arrays.asList("Uranium-238,Uranium-235".split(","));
    List<FactorioItems> items;
    Map<String, HttpClient> clients;
    Set<String> currentItems;
    @Autowired
    private FactorioService factorioService;

    @RequestMapping("/getDataFormFactorio")
    @ResponseBody
    public String getDataFormFactorio() throws IOException, InterruptedException {
        items = Collections.synchronizedList(new ArrayList<>());
        currentItems = Collections.synchronizedSet(new HashSet<>());
        clients = Collections.synchronizedMap(new HashMap<>());
        sendAsyncByUrl("/Production_science_pack");
        do {
            Thread.sleep(3000);
        } while (!clients.isEmpty());
        ObjectWriter ow =  new ObjectMapper().writer().withDefaultPrettyPrinter();
        Flux<FactorioItems> r = factorioService.saves(items);
        return ow.writeValueAsString(r.toStream().toList());
        //return items.toString();
    }

    public void sendAsyncByUrl(String url) {
        sendAsyncByUrl(baseUrl, url);
    }

    public void sendAsyncByUrl(String baseUrl, String url) {
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(baseUrl + url))
                .build();
        HttpClient client = HttpClient.newBuilder()
                .build();
        clients.put(url, client);
        client.sendAsync(request, HttpResponse.BodyHandlers.ofString())
                .thenApply(this::applyRequest);
    }

    public String applyRequest(HttpResponse<String> response) {
        Document document = Jsoup.parse(response.body());
        String url = response.uri().toString();
        url = url.substring(url.lastIndexOf("/"));
        Elements elements;
        Element element;
        List<FactorioItems> preItems;
        List<Double> costs;
        FactorioCostItem cost;
        List<FactorioCostItem> costItems;
        Set<String> nextItems = new HashSet<>();
        String name;
        String description;
        // init item
        description = document.select("tr.border-top:contains(Prototype type)").select("a").text();
        if ("recipe".contains(description)) {
            clients.remove(url);
            return url;
        }
        FactorioItems item = new FactorioItems();
        item.setId(urlToId(url));
        name = document.select("td.infobox-header-text").select("span").text();
        item.setName(name);
        description = baseUrl + document.select("td.infobox-header-text")
                .prev().select("img").attr("src");
        item.setDescription(description);
        costItems = new ArrayList<>();
        item.setCosts(costItems);
        item.setConsumed(new ArrayList<>());
        // Found Founder
        elements = document.select("tr.border-top:contains(Recipe)");
        if (!elements.isEmpty()) {
            element = elements.getFirst().nextElementSibling();
            if (!banList.contains(item.getId()) && null != element) {
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
                    for (int i = 1; i < preItems.size() - 1; i++) {
                        cost = new FactorioCostItem();
                        cost.setCosts(costs.get(i) / baseCost);
                        cost.setCostItemId(preItems.get(i).getId());
                        costItems.add(cost);
                        nextItems.add(idToUrl(preItems.get(i).getId()));
                    }
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
                    item.setConsumed(preItems.stream().map(FactorioItems::getId).toList());
                    nextItems.addAll(item.getConsumed().stream().map(this::idToUrl).toList());
                }
            }
        }
        // add item
        items.add(item);
        // search for next Url
        nextItems.removeAll(currentItems);
        currentItems.addAll(nextItems);
        for (String nextUrl : nextItems) {
            sendAsyncByUrl(nextUrl);
        }
        clients.remove(url);
        return url;
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

    @RequestMapping("/getFactorioData")
    @ResponseBody
    public String getFactorioData() throws JsonProcessingException {
        Flux<FactorioItems> items = factorioService.findAll();
        return new ObjectMapper().writer().withDefaultPrettyPrinter()
                .writeValueAsString(items.toStream().toList());
    }
}
