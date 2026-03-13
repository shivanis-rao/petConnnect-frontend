import { useState } from "react";

const useLocation = () => {
  const [locLoading, setLocLoading] = useState(false);
  const [locError, setLocError] = useState(null);

  const getCity = async () => {
    setLocLoading(true);
    setLocError(null);

    if (!navigator.geolocation) {
      setLocError("Geolocation is not supported by your browser");
      setLocLoading(false);
      return null;
    }

    try {
      // HIGH ACCURACY MODE — forces GPS instead of IP/WiFi
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true, // forces real GPS
          timeout: 10000, // wait up to 10 seconds
          maximumAge: 0,
        });
      });

      const { latitude, longitude } = position.coords;

      console.log("Got coordinates:", latitude, longitude); //  verify

      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
        {
          headers: {
            "Accept-Language": "en",
            "User-Agent": "PetConnect/1.0",
          },
        },
      );

      const data = await response.json();

      console.log("Nominatim response:", data.address);
      const city =
        data.address.city ||
        data.address.town ||
        data.address.suburb ||
        data.address.village ||
        data.address.county ||
        data.address.state_district;

      const zipcode = data.address.postcode || "";
      console.log("Full address:", JSON.stringify(data.address));

      setLocLoading(false);
      return { city, zipcode };
    } catch (err) {
      if (err.code === 1) {
        setLocError(
          "Location access denied. Please allow in browser settings.",
        );
      } else if (err.code === 2) {
        setLocError("Location unavailable. Try again or enter city manually.");
      } else if (err.code === 3) {
        setLocError("Location timed out. Try again.");
      } else {
        setLocError("Could not get your location. Please enter city manually.");
      }
      setLocLoading(false);
      return null;
    }
  };

  return { getCity, locLoading, locError };
};

export default useLocation;
