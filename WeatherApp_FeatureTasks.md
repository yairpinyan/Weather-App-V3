# Feature Implementation Task List: Weather App Enhancements

This file tracks the implementation status of the three new features approved for the Weather App. Update the status of each subtask as work progresses.

---

## 1. Geolocation-based Weather Fetching (“My Location” Card)
- [x] **1.1** Create `useGeolocationWeather.ts` hook (geolocation, reverse geocoding, weather fetch, state/localStorage)
- [x] **1.2** Update `<App>` to call the hook and prepend “My Location” card
- [x] **1.3** Update city state management (e.g., `citiesSlice`) to support `geoCity`
- [x] **1.4** UI: Distinguish “My Location” card visually
- [x] **1.5** Playwright & unit tests (mock geolocation, silent fail, correct card, normal city add)

## 2. Hourly Forecast Tab for Selected City
- [ ] **2.1** Extend API layer to fetch hourly forecast for a city
- [ ] **2.2** Update city panel/component: add tab/UI for hourly forecast (next 24h: time, temp, icon, precipitation, wind)
- [ ] **2.3** Update data model/types for hourly data
- [ ] **2.4** Playwright & unit tests (tab switch, correct hourly data, UI accessibility)

## 3. Weather Alerts & Notifications System
- [ ] **3.1** Extend API layer to fetch weather alerts for a city
- [ ] **3.2** Add alert banner/notification UI (severity color/icon, dismiss/mute)
- [ ] **3.3** Update data model/types for alerts
- [ ] **3.4** Playwright & unit tests (alert display, severity, dismiss/mute, no-alert case)

---

**Legend:**
- [ ] Not started
- [/] In progress
- [x] Complete 