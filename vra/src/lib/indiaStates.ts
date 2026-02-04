export interface StateData {
    name: string;
    lat: number;
    lng: number;
    pastFloods: string;
    // Fields that will be populated dynamically or have defaults
    rainfall?: number;
    humidity?: number;
    risk?: 'Low' | 'Medium' | 'High' | 'Severe';
    trend?: 'stable' | 'increasing' | 'decreasing';
    disasterPercent?: number;
}

export const INDIA_STATES: StateData[] = [
    { name: 'Andhra Pradesh', lat: 15.9129, lng: 79.7400, pastFloods: '2020: Heavy rains in Rayalaseema' },
    { name: 'Arunachal Pradesh', lat: 28.2180, lng: 94.7278, pastFloods: '2017: Flash floods in several districts' },
    { name: 'Assam', lat: 26.2006, lng: 92.9376, pastFloods: 'Annual flooding of Brahmaputra (Major: 2020)' },
    { name: 'Bihar', lat: 25.0961, lng: 85.3131, pastFloods: 'Kosi river floods frequently (2008, 2017)' },
    { name: 'Chhattisgarh', lat: 21.2787, lng: 81.8661, pastFloods: '2020: Mahanadi river overflow' },
    { name: 'Goa', lat: 15.2993, lng: 74.1240, pastFloods: '2021: Major floods in July' },
    { name: 'Gujarat', lat: 22.2587, lng: 71.1924, pastFloods: '2017: Banaskantha flood' },
    { name: 'Haryana', lat: 29.0588, lng: 76.0856, pastFloods: '2023: Yamuna overflow affecting regions' },
    { name: 'Himachal Pradesh', lat: 31.1048, lng: 77.1734, pastFloods: '2023: Severe flash floods and landslides' },
    { name: 'Jharkhand', lat: 23.6102, lng: 85.2799, pastFloods: 'Occasional flash floods due to dam releases' },
    { name: 'Karnataka', lat: 15.3173, lng: 75.7139, pastFloods: '2019: North Karnataka floods' },
    { name: 'Kerala', lat: 10.8505, lng: 76.2711, pastFloods: '2018: Century\'s worst floods' },
    { name: 'Madhya Pradesh', lat: 22.9734, lng: 78.6569, pastFloods: '2020: Chambal and Narmada floods' },
    { name: 'Maharashtra', lat: 19.7515, lng: 75.7139, pastFloods: '2005: Mumbai floods; 2021: Chiplun floods' },
    { name: 'Manipur', lat: 24.6637, lng: 93.9063, pastFloods: '2017: Cyclone Mora impact' },
    { name: 'Meghalaya', lat: 25.4670, lng: 91.3662, pastFloods: '2022: Highest rainfall and flooding' },
    { name: 'Mizoram', lat: 23.1645, lng: 92.9376, pastFloods: '2017: Flash floods' },
    { name: 'Nagaland', lat: 26.1584, lng: 94.5624, pastFloods: '2018: Landslides and floods' },
    { name: 'Odisha', lat: 20.9517, lng: 85.0985, pastFloods: 'Frequent cyclones and floods (Cyclone Fani 2019)' },
    { name: 'Punjab', lat: 31.1471, lng: 75.3412, pastFloods: '2023: Sutlej river flooding' },
    { name: 'Rajasthan', lat: 27.0238, lng: 74.2179, pastFloods: '2017: Floods in arid regions like Barmer' },
    { name: 'Sikkim', lat: 27.5330, lng: 88.5122, pastFloods: '2023: Glacial Lake Outburst Flood' },
    { name: 'Tamil Nadu', lat: 11.1271, lng: 78.6569, pastFloods: '2015: Chennai floods' },
    { name: 'Telangana', lat: 18.1124, lng: 79.0193, pastFloods: '2020: Hyderabad floods' },
    { name: 'Tripura', lat: 23.9408, lng: 91.9882, pastFloods: '2022: Agartala flash floods' },
    { name: 'Uttar Pradesh', lat: 26.8467, lng: 80.9462, pastFloods: 'Annual flooding in eastern districts' },
    { name: 'Uttarakhand', lat: 30.0668, lng: 79.0193, pastFloods: '2013: Kedarnath tragedy' },
    { name: 'West Bengal', lat: 22.9868, lng: 87.8550, pastFloods: 'Frequent river & coastal flooding' },
    { name: 'Delhi', lat: 28.7041, lng: 77.1025, pastFloods: '2023: Yamuna record levels' }
];
