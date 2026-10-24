package com.hcl.VenueVista.controller;

import com.hcl.VenueVista.dto.DashboardAnalyticsDTO;
import com.hcl.VenueVista.service.DashboardAnalyticsService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/analytics")
public class DashboardAnalyticsController {

    private final DashboardAnalyticsService dashboardAnalyticsService;

    public DashboardAnalyticsController(
            DashboardAnalyticsService dashboardAnalyticsService) {
        this.dashboardAnalyticsService = dashboardAnalyticsService;
    }

    @GetMapping("/dashboard")
    public DashboardAnalyticsDTO getDashboardAnalytics() {
        return dashboardAnalyticsService.getDashboardAnalytics();
    }
}