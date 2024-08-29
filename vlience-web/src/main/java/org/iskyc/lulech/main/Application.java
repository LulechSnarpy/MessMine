package org.iskyc.lulech.main;

import org.iskyc.lulech.main.service.FactorioService;
import org.iskyc.lulech.main.service.dao.FactorioItems;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.elasticsearch.repository.config.EnableElasticsearchRepositories;
import org.springframework.web.bind.annotation.*;

@SpringBootApplication
@RestController
@EnableElasticsearchRepositories(basePackages
        = "org.iskyc.lulech.main.service")
@ComponentScan(basePackages = { "org.iskyc.lulech.main.service" })
public class Application {
    @Autowired
    FactorioService factorioService;

    public static void main(String[] args) { SpringApplication.run(Application.class, args); }

    @GetMapping("/hello")
    @ResponseBody
    public String hello(@RequestParam(value = "name", defaultValue = "World") String name) throws Exception {
        if(!name.equals("World")) throw new Exception("error test");
        return String.format("Hello %s!", name);
    }

    @RequestMapping("/save")
    @ResponseBody
    public String saveFactorio(FactorioItems items) {
        FactorioItems saved = factorioService.save(items);
        if (null != saved.getId()) {
            return "success";
        } else {
            return "failed";
        }
    }
}
