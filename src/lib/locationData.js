export const LOCATION_OPTIONS = {
  Bangladesh: [
    "Dhaka",
    "Chattogram",
    "Sylhet",
    "Rajshahi",
    "Khulna",
    "Barishal",
    "Rangpur",
    "Mymensingh",
  ],
  India: ["Kolkata", "Delhi", "Mumbai", "Bengaluru", "Chennai"],
  Pakistan: ["Karachi", "Lahore", "Islamabad"],
  Nepal: ["Kathmandu", "Pokhara"],
  "Sri Lanka": ["Colombo", "Kandy"],
};

export const COUNTRY_OPTIONS = Object.keys(LOCATION_OPTIONS);

export function getCityOptions(country) {
  return LOCATION_OPTIONS[country] || [];
}
