// SubwayLoadSave.js

/**
 * Expected TXT Format:
 *
 * start
 * >
 * 1| 'Middle West-East'| '#EA1975'| 'horizontal';
 * 2| 'Top West-East'| '#673067'| 'vertical';
 * >
 * "Üsküdar"|1|1|'null'|41.02561018651184|29.013849571135417;
 * "Fıstıkağacı"|1|2|'null'|41.02836140084836|29.02861429701202;
 * end
 *
 * - Each property is separated by a |.
 * - Each record (line or station) ends with a semicolon (;).
 * - The two sections (lines and stations) are separated by a > character.
 * - The file begins with "start" and ends with "end".
 */

/**
 * Imports subway data from a text string.
 * Returns an object with:
 *  - lines: Array of line objects { id, name, color, orientation }
 *  - stations: Array of station objects { name, line, stationNumber, transfer, realX, realY }
 *  - grid: Object with { minX, maxX, minY, maxY } computed from station coordinates.
 */
export function importSubwayData(txt) {
    const result = { lines: [], stations: [], grid: {} };
    const trimmed = txt.trim();
    if (!trimmed.startsWith('start') || !trimmed.endsWith('end')) {
      throw new Error("Invalid file format: missing start/end markers.");
    }
    // Remove the "start" and "end" markers.
    let content = trimmed.substring(5, trimmed.length - 3).trim();
    // Split by the ">" character to separate sections.
    const sections = content.split('>').map(s => s.trim()).filter(s => s.length > 0);
    if (sections.length < 2) {
      throw new Error("Invalid file format: missing sections.");
    }
    // Section 0: Lines; Section 1: Stations.
    const linesData = sections[0];
    const stationsData = sections[1];
  
    // Parse lines: each record is separated by a semicolon.
    const lineRecords = linesData.split(';').map(s => s.trim()).filter(s => s.length > 0);
    result.lines = lineRecords.map(record => {
      const parts = record.split('|').map(s => s.trim());
      // Expected 4 parts: id, name, color, orientation.
      return {
        id: Number(parts[0]),
        name: parts[1].replace(/^['"]|['"]$/g, ''),
        color: parts[2].replace(/^['"]|['"]$/g, ''),
        orientation: parts[3].replace(/^['"]|['"]$/g, '')
      };
    });
  
    // Parse stations: each record is separated by a semicolon.
    const stationRecords = stationsData.split(';').map(s => s.trim()).filter(s => s.length > 0);
    result.stations = stationRecords.map(record => {
      const parts = record.split('|').map(s => s.trim());
      // Expected 6 parts: name, line, stationNumber, transfer, realX, realY.
      return {
        name: parts[0].replace(/^["']|["']$/g, ''),
        line: Number(parts[1]),
        stationNumber: Number(parts[2]),
        transfer: parts[3].replace(/^['"]|['"]$/g, '') === 'null' ? null : parts[3].replace(/^['"]|['"]$/g, ''),
        realX: Number(parts[4]),
        realY: Number(parts[5])
      };
    });
  
    // Compute grid boundaries from stations' real-world coordinates.
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    result.stations.forEach(station => {
      if (station.realX < minX) minX = station.realX;
      if (station.realX > maxX) maxX = station.realX;
      if (station.realY < minY) minY = station.realY;
      if (station.realY > maxY) maxY = station.realY;
    });
    result.grid = { minX, maxX, minY, maxY };
  
    return result;
  }
  
  /**
   * Exports subway data to a text string.
   * Data should be an object with:
   *  - lines: Array of line objects { id, name, color, orientation }
   *  - stations: Array of station objects { name, line, stationNumber, transfer, realX, realY }
   * The output format will follow the specified TXT structure.
   */
  export function exportSubwayData(data) {
    // Convert lines array to string.
    const linesStr = data.lines.map(line =>
      `${line.id}| '${line.name}'| '${line.color}'| '${line.orientation}'`
    ).join(';') + ';';
  
    // Convert stations array to string.
    const stationsStr = data.stations.map(station => {
      const transferStr = station.transfer === null ? "'null'" : `'${station.transfer}'`;
      return `"${station.name}"|${station.line}|${station.stationNumber}|${transferStr}|${station.realX}|${station.realY}`;
    }).join(';') + ';';
  
    return `start\n>\n${linesStr}\n>\n${stationsStr}\nend`;
  }
  