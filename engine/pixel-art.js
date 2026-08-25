// Porygon Trail - Pixel Art Helper
// Turns a small ASCII grid into a box-shadow pixel sprite (same technique
// as .trail-trainer-sprite), so landmark buildings can be defined as
// readable row-strings instead of hand-written box-shadow lists.
(function() {
    const PT = window.PorygonTrail;
    PT.Engine = PT.Engine || {};

    // rows: array of equal-length strings. Each character maps to a color
    // via `colors` ({ char: 'var(--gb-...)' }); '.' is always transparent.
    function building(rows, colors, unit) {
        unit = unit || 2;
        const shadows = [];
        rows.forEach((row, y) => {
            for (let x = 0; x < row.length; x++) {
                const ch = row[x];
                if (ch === '.' || !colors[ch]) continue;
                shadows.push(`${x * unit}px ${y * unit}px ${colors[ch]}`);
            }
        });
        const width = Math.max(...rows.map(r => r.length)) * unit;
        const height = rows.length * unit;
        return { shadow: shadows.join(', '), width, height };
    }

    // Convenience: returns a ready-to-embed <div> string positioned via
    // `style` (left/bottom/etc, same convention as the other pixel-scene
    // elements), sized and colored from the ASCII grid.
    function buildingDiv(rows, colors, style, unit) {
        const { shadow, width, height } = building(rows, colors, unit);
        return `<div class="pixel-building-sprite" style="${style || ''};width:${width}px;height:${height}px;--px-shadow:${shadow}"></div>`;
    }

    PT.Engine.PixelArt = { building, buildingDiv };
})();
