// Minimal TopoJSON decoder — only what the atlas needs (Polygon/MultiPolygon
// objects with quantized, delta-encoded arcs). Zero dependencies.

export function decodeTopology(topology, objectName) {
  const { transform, arcs } = topology;
  const object = topology.objects[objectName];
  if (!object) throw new Error(`TopoJSON object not found: ${objectName}`);

  const decodedArcs = arcs.map((arc) => {
    let x = 0;
    let y = 0;
    return arc.map(([dx, dy]) => {
      x += dx;
      y += dy;
      return transform
        ? [
            x * transform.scale[0] + transform.translate[0],
            y * transform.scale[1] + transform.translate[1],
          ]
        : [x, y];
    });
  });

  function ring(arcIndexes) {
    const points = [];
    for (const index of arcIndexes) {
      // negative index = reversed arc, ones' complement
      const arc = index < 0 ? decodedArcs[~index].slice().reverse() : decodedArcs[index];
      // skip duplicated junction point between consecutive arcs
      for (let i = points.length ? 1 : 0; i < arc.length; i += 1) {
        points.push(arc[i]);
      }
    }
    return points;
  }

  return object.geometries.map((geometry) => {
    let polygons = [];
    if (geometry.type === "Polygon") {
      polygons = [geometry.arcs.map(ring)];
    } else if (geometry.type === "MultiPolygon") {
      polygons = geometry.arcs.map((poly) => poly.map(ring));
    }
    return {
      id: geometry.id ?? null,
      properties: geometry.properties ?? {},
      polygons, // [polygon][ring][point][lon,lat]
    };
  });
}
