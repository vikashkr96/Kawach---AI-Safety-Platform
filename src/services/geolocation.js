/**
 * Calculate distance in meters between two lat/lng coordinates (Haversine Formula)
 */
export function calculateDistanceMeters(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // Earth radius in meters
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

/**
 * Calculate minimum distance from a location point to a route polyline
 */
export function calculateDeviationFromRoute(currentLoc, routePoints) {
  if (!currentLoc || !routePoints || routePoints.length < 2) return 0;
  
  let minDistance = Infinity;
  for (let i = 0; i < routePoints.length; i++) {
    const pt = routePoints[i];
    const dist = calculateDistanceMeters(currentLoc.lat, currentLoc.lng, pt.lat, pt.lng);
    if (dist < minDistance) {
      minDistance = dist;
    }
  }
  return minDistance;
}

/**
 * Generate simulated waypoint polyline between origin and destination
 */
export function generateRoutePoints(start, end, steps = 10) {
  const points = [];
  for (let i = 0; i <= steps; i++) {
    const ratio = i / steps;
    // Add subtle curvature to simulate real streets
    const offset = Math.sin(ratio * Math.PI) * 0.0015;
    points.push({
      lat: start.lat + (end.lat - start.lat) * ratio + offset,
      lng: start.lng + (end.lng - start.lng) * ratio - offset * 0.5
    });
  }
  return points;
}
