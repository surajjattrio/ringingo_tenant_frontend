"use client";
import axios from "axios";

// PROJECT IMPORT
//import { baseUrl } from "@/API/baseURL";
import { Danger } from "./services/toasterServices";

// THIRD - PARTY IMPORT
import Cookies from "js-cookie";

export const apiInstance = axios.create({
  baseURL: process.env.BASE_URL
});

apiInstance.interceptors.request.use(
  (config) => {
    const user = JSON.parse(Cookies.get("user") || "{}");
    config.headers.Authorization =
      user && user?.access_token ? `Bearer ${user.access_token}` : null;

    // Add Geolocation Headers
    const geoLat = Cookies.get("geo_lat");
    const geoLng = Cookies.get("geo_lng");
    if (geoLat && geoLng) {
      config.headers['x-geo-lat'] = geoLat;
      config.headers['x-geo-lng'] = geoLng;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor
apiInstance.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (typeof error.response.data.message === "string") {
      if (
        error.response.data.message === "Unauthorized" &&
        error.response.data.statusCode === 401
      ) {
        Cookies.remove("user");
        Cookies.remove("masterUser");
        window.location.reload();
      } else {
        Danger(error.response.data.message);
      }
    } else {
      for (let i = 0; i < error?.response?.data?.message?.length; i++) {
        Danger(error.response.data.message[i]);
      }
    }
    return Promise.reject(error);
  }
);
