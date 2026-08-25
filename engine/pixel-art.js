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

    // Generates a generic building shape (array of row-strings, using the
    // same R/W/D convention as a hand-written grid) instead of requiring
    // every landmark to be hand-drawn pixel-by-pixel. Bigger buildings are
    // just bigger/taller parameters here, keeping the size hierarchy
    // (house < shop < gym < tower...) easy to reason about and extend.
    function civicBuilding(opts) {
        const width = opts.width;
        const floors = opts.floors || 1;
        const doorWidth = opts.doorWidth || 3;
        const windowWidth = opts.windowWidth || 2;
        const roof = opts.roof || 'flat';
        const antenna = !!opts.antenna;
        const windowStyle = opts.windowStyle || 'sides';
        const winInset = 3;

        const rows = [];
        const isBorder = x => x === 0 || x === width - 1;
        const row = fillFn => {
            let r = '';
            for (let x = 0; x < width; x++) r += fillFn(x);
            return r;
        };

        if (antenna) {
            const mid = Math.floor(width / 2);
            rows.push(row(x => x === mid ? 'R' : '.'));
            rows.push(row(x => x === mid ? 'R' : '.'));
        }

        if (roof === 'peak') {
            [3, Math.min(width - 6, 7), width - 4].forEach(peakWidth => {
                const pad = Math.floor((width - peakWidth) / 2);
                rows.push(row(x => (x >= pad && x < pad + peakWidth) ? 'R' : '.'));
            });
            rows.push(row(() => 'R'));
        } else {
            rows.push(row(x => isBorder(x) ? '.' : 'R'));
            rows.push(row(() => 'R'));
            rows.push(row(() => 'R'));
        }

        for (let f = 0; f < floors; f++) {
            for (let r = 0; r < 2; r++) {
                rows.push(row(x => {
                    if (isBorder(x)) return 'R';
                    if (windowStyle === 'center') {
                        return x === Math.floor(width / 2) ? 'D' : 'W';
                    }
                    if (x >= winInset && x < winInset + windowWidth) return 'D';
                    if (x < width - winInset && x >= width - winInset - windowWidth) return 'D';
                    return 'W';
                }));
            }
            rows.push(row(x => isBorder(x) ? 'R' : 'W'));
        }

        const doorStart = Math.floor((width - doorWidth) / 2);
        for (let r = 0; r < 2; r++) {
            rows.push(row(x => {
                if (isBorder(x)) return 'R';
                if (x >= doorStart && x < doorStart + doorWidth) return 'D';
                return 'W';
            }));
        }
        rows.push(row(() => 'R'));

        return rows;
    }

    PT.Engine.PixelArt = { building, buildingDiv, civicBuilding };
})();
