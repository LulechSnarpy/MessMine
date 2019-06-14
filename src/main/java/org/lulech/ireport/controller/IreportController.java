package org.lulech.ireport.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@RequestMapping("/ireport")
public class IreportController {

    @ResponseBody
    @RequestMapping("/demo")
    public String demo () {
        return "demo";
    }
}
