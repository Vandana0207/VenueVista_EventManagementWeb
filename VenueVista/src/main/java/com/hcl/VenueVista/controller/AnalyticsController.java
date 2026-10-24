package com.hcl.VenueVista.controller;

import com.hcl.VenueVista.dto.SalesAnalyticsDTO;
import com.hcl.VenueVista.service.AnalyticsService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/analytics")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    public AnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @GetMapping("/event/{eventId}")
    public SalesAnalyticsDTO getEventSalesAnalytics(
            @PathVariable Long eventId) {

        return analyticsService.getEventSalesAnalytics(eventId);
    }
}