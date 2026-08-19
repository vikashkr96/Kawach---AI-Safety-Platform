export const SEED_INCIDENTS = [
  {
    id: 'inc-1',
    category: 'lighting',
    title: 'Broken Streetlights on Oak Alley',
    description: 'Entire 200m stretch of Oak Alley has 4 burnt-out streetlights. Pitch black after 7:30 PM.',
    lat: 37.7752,
    lng: -122.4180,
    timeOfDay: 'Night (Post 8PM)',
    severity: 'Medium',
    createdAt: '2026-08-15T21:10:00Z',
    reporter: 'Community Member'
  },
  {
    id: 'inc-2',
    category: 'harassment',
    title: 'Verbal Harassment near Metro North Exit',
    description: 'Group loitering near unlit underpass shouting at solo walkers late at night.',
    lat: 37.7785,
    lng: -122.4132,
    timeOfDay: 'Late Night',
    severity: 'High',
    createdAt: '2026-08-16T22:45:00Z',
    reporter: 'Student Resident'
  },
  {
    id: 'inc-3',
    category: 'isolated_stretch',
    title: 'Isolated Construction Detour',
    description: 'Construction fencing blocks pedestrian sidewalk, forcing pedestrians down narrow dead-end lane.',
    lat: 37.7721,
    lng: -122.4215,
    timeOfDay: 'Evening',
    severity: 'Medium',
    createdAt: '2026-08-17T19:30:00Z',
    reporter: 'Commuter'
  },
  {
    id: 'inc-4',
    category: 'unsafe_crossing',
    title: 'Speeding Vehicles & Blind Turn Crossing',
    description: 'No pedestrian signal or crosswalk light. Vehicles speed around corner with zero visibility.',
    lat: 37.7810,
    lng: -122.4190,
    timeOfDay: 'All Day',
    severity: 'Low',
    createdAt: '2026-08-18T14:15:00Z',
    reporter: 'Local Resident'
  },
  {
    id: 'inc-5',
    category: 'harassment',
    title: 'Followed near Park Edge Pathway',
    description: 'Unlit park boundary path. Walker reported being followed until reaching main avenue.',
    lat: 37.7768,
    lng: -122.4250,
    timeOfDay: 'Night',
    severity: 'High',
    createdAt: '2026-08-18T23:05:00Z',
    reporter: 'Kavach User'
  }
];

export const CITY_PRESETS = [
  {
    name: 'San Francisco (Default)',
    lat: 37.7749,
    lng: -122.4194,
    zoom: 14
  },
  {
    name: 'New York City',
    lat: 40.7128,
    lng: -74.0060,
    zoom: 14
  },
  {
    name: 'London',
    lat: 51.5074,
    lng: -0.1278,
    zoom: 14
  },
  {
    name: 'Bengaluru / New Delhi',
    lat: 12.9716,
    lng: 77.5946,
    zoom: 14
  }
];
