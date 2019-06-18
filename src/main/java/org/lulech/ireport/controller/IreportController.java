package org.lulech.ireport.controller;

import net.sf.jasperreports.engine.JRDataSource;
import net.sf.jasperreports.engine.JasperRunManager;
import net.sf.jasperreports.engine.data.JRBeanCollectionDataSource;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/ireport")
public class IreportController {

    @RequestMapping("/demo")
    public String demo () {
        return "demo";
    }

    @ResponseBody
    @GetMapping("/download")
    public ResponseEntity<Resource> export() throws Exception {
        Resource file = new UrlResource(Paths.get("upload-dir").resolve("report1.jasper").toUri());
        Map<String, Object> params = new HashMap<>();
        params.put("Title" , "Title1");
        params.put("PageHeader", "PageHeader1");
        params.put("ColumnHeader", "ColumnsHeader1");
        Collection<Map<String, Object>> data = new ArrayList<>();
        Map<String, Object> k = new HashMap<>();
        k.put("Title", "title1");
        k.put("Value", "123");
        data.add(k);
        k = new HashMap<>();
        k.put("Title", "title2");
        k.put("Value", "456");
        data.add(k);
        JRDataSource dataSource = new JRBeanCollectionDataSource(data);
        byte[] bytes = JasperRunManager.runReportToPdf(file.getInputStream(), params, dataSource);
        Resource body = new ByteArrayResource(bytes);
        return ResponseEntity.ok().header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\""+file.getFilename().replace("jasper", "pdf")+"\"").body(body);
    }
}
