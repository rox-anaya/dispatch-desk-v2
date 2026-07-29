export function generateFplXml(depIcao: string, arrIcao: string, route: string = "DCT") {
  return `<?xml version="1.0" encoding="utf-8"?>
<flight-plan xmlns="http://www.garmin.com/xmlschemas/FlightPlan/v1">
  <author>Dispatch Desk V2</author>
  <route>
    <route-point>
      <waypoint-identifier>${depIcao}</waypoint-identifier>
      <waypoint-type>Airport</waypoint-type>
    </route-point>
    <route-point>
      <waypoint-identifier>${arrIcao}</waypoint-identifier>
      <waypoint-type>Airport</waypoint-type>
    </route-point>
  </route>
</flight-plan>`;
}
