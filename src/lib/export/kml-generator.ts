export function generateKml(depIcao: string, arrIcao: string, depLat = 13.1979, depLon = 77.7063, arrLat = 19.0887, arrLon = 72.8679) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Document>
    <name>${depIcao} to ${arrIcao} Flight Plan</name>
    <Style id="flightPath">
      <LineStyle>
        <color>ff00ffff</color>
        <width>4</width>
      </LineStyle>
    </Style>
    <Placemark>
      <name>${depIcao} - ${arrIcao}</name>
      <styleUrl>#flightPath</styleUrl>
      <LineString>
        <tessellate>1</tessellate>
        <coordinates>
          ${depLon},${depLat},0 ${arrLon},${arrLat},0
        </coordinates>
      </LineString>
    </Placemark>
  </Document>
</kml>`;
}
