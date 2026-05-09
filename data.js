const STORES = [
  {
    id: "s1",
    name: "Shinjuku West Exit",
    address: "1-1-1 Nishi-Shinjuku, Shinjuku-ku, Tokyo, Shinjuku Palette Building 5F",
    lat: 35.6923,
    lng: 139.6982,
    phone: "03-1234-5678",
    status: "Open", // Can be Open, Closed, Closes Soon
    hours: "10:00 - 23:00",
    lastOrder: "22:30",
    distance: "3 mins walk from Shinjuku Station West Exit",
    facilities: ["drink-bar", "non-smoking", "free-wifi"],
    crowdLevel: 80, // percentage 0-100
    heroImage: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: "s2",
    name: "Shinjuku South",
    address: "3-4-5 Shinjuku, Shinjuku-ku, Tokyo",
    lat: 35.6888,
    lng: 139.7022,
    phone: "03-2345-6789",
    status: "Closed",
    hours: "10:00 - 22:00",
    lastOrder: "21:30",
    distance: "0.8 km away",
    facilities: ["parking", "free-wifi", "e-payments"],
    crowdLevel: 0,
    heroImage: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: "s3",
    name: "Yoyogi Station Front",
    address: "1-1-1 Yoyogi, Shibuya-ku, Tokyo, Ground Floor",
    lat: 35.6830,
    lng: 139.7020,
    phone: "03-3456-7890",
    status: "Open",
    hours: "11:00 - 23:30",
    lastOrder: "23:00",
    distance: "1.2 km away",
    facilities: ["e-payments", "non-smoking"],
    crowdLevel: 30,
    heroImage: "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: "s4",
    name: "Shibuya Center Gai",
    address: "25-1 Udagawacho, Shibuya-ku, Tokyo",
    lat: 35.6601,
    lng: 139.6993,
    phone: "03-4567-8901",
    status: "Closes Soon",
    hours: "10:00 - 24:00",
    lastOrder: "23:30",
    distance: "3.5 km away",
    facilities: ["smoking-room", "drink-bar"],
    crowdLevel: 90,
    heroImage: "https://images.unsplash.com/photo-1525610553991-2bede1a236e2?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: "s5",
    name: "Roppongi Hills",
    address: "6-10-1 Roppongi, Minato-ku, Tokyo",
    lat: 35.6605,
    lng: 139.7291,
    phone: "03-5678-9012",
    status: "Open",
    hours: "11:00 - 23:00",
    lastOrder: "22:30",
    distance: "5.0 km away",
    facilities: ["parking", "non-smoking", "drink-bar", "free-wifi", "e-payments"],
    crowdLevel: 50,
    heroImage: "https://images.unsplash.com/photo-1544148103-0773bf10d330?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: "s6",
    name: "Ikebukuro Sunshine",
    address: "3-1-1 Higashi-Ikebukuro, Toshima-ku, Tokyo",
    lat: 35.7290,
    lng: 139.7190,
    phone: "03-6789-0123",
    status: "Open",
    hours: "10:00 - 22:30",
    lastOrder: "22:00",
    distance: "6.5 km away",
    facilities: ["drink-bar", "free-wifi", "non-smoking"],
    crowdLevel: 65,
    heroImage: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1200&q=80"
  }
];

const FACILITY_ICONS = {
  "drink-bar": { icon: "local_cafe", label: "Drink Bar" },
  "non-smoking": { icon: "smoke_free", label: "Non-Smoking" },
  "smoking-room": { icon: "smoking_rooms", label: "Smoking Room" },
  "free-wifi": { icon: "wifi", label: "Free Wi-Fi" },
  "parking": { icon: "local_parking", label: "Parking" },
  "e-payments": { icon: "credit_card", label: "E-Payments" }
};
