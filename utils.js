export const BACKGROUND_COLOR = "#001F3F";
export const INCOMPATIBLE_COLOR = "#404040";
export const TEXT_COLOR_LIGHT = "#FFFFFF";
export const TEXT_COLOR_DARK = "#000000";
export const NORMAL_BORDER_COLOR = "#aaa";
export const SELECTED_BORDER_COLOR = "#000";
export const BORDER_WIDTH = "0.5px";

export function getLighterShade(color, level) {
    const hsl = d3.hsl(color);
    return d3.hsl(hsl.h, hsl.s, Math.min(0.9, hsl.l + level * 0.13)).toString();
}

export function getHighlightShade(color) {
    const hsl = d3.hsl(color);
    return d3.hsl(hsl.h, hsl.s * 0.7, 0.9).toString();
}

export const incompatiblePairs = [
    ['Banner', 'Interstitial'],
    ['Facebook', 'Instagram'],
    ['Desktop', 'Mobile web'],
    ['CTR', 'VCR'],
    ['Arrival', 'ELAR'],
    ['1P Location', '3P Geo/Demo'],
    ['Video', 'Audio'],
    ['CTV', 'Digital OOH'],
    ['Open Web', 'Guaranteed engagement'],
    ['InStadium', 'Display'],
    ['Desktop', 'Mobile in-app'],
    ['Direct integration', 'Programmatic'],
    ['Unique views', 'Frequency'],
    ['CTR', 'Attention'],
    ['CPC', 'CPM'],
    ['Conversions', 'Location visits'],
    ['Arrival', 'OOH Exposure'],
    ['Ad relevance', 'Engagement metrics'],
    ['Sales lift', 'Brand lift'],
    ['Viewability', 'Fraud'],
    ['Creative', 'Objectives'],
];

export function areIncompatible(item1, item2) {
    return incompatiblePairs.some(pair => 
        (pair[0] === item1 && pair[1] === item2) || (pair[0] === item2 && pair[1] === item1)
    );
}

export function truncateText(text, maxLength) {
    return text.length > maxLength ? text.slice(0, maxLength - 3) + '...' : text;
}

export function getTileId(d) {
    return `tile-${d.depth}-${Math.round(d.x0 * 1000)}-${Math.round(d.x1 * 1000)}-${Math.round(d.y0 * 1000)}-${Math.round(d.y1 * 1000)}`;
}

export function createShortCurvedArrow(startAngle, endAngle, clockwise, arrowRadius) {
    const arrowPath = d3.path();
    const arrowSize = 10;
    const arrowAngle = 0.1;

    arrowPath.arc(0, 0, arrowRadius, startAngle, endAngle, !clockwise);

    const endX = Math.cos(endAngle) * arrowRadius;
    const endY = Math.sin(endAngle) * arrowRadius;

    const tipAngle1 = clockwise ? endAngle - arrowAngle : endAngle + arrowAngle;
    const tip1X = Math.cos(tipAngle1) * (arrowRadius - arrowSize);
    const tip1Y = Math.sin(tipAngle1) * (arrowRadius - arrowSize);

    const tipAngle2 = clockwise ? endAngle - arrowAngle : endAngle + arrowAngle;
    const tip2X = Math.cos(tipAngle2) * (arrowRadius + arrowSize);
    const tip2Y = Math.sin(tipAngle2) * (arrowRadius + arrowSize);

    arrowPath.lineTo(tip1X, tip1Y);
    arrowPath.lineTo(endX, endY);
    arrowPath.lineTo(tip2X, tip2Y);

    return arrowPath.toString();
}

export function showDefaultInfoPanel() {
    const infoBox = document.getElementById('info-box');
    const infoTitle = document.getElementById('info-title');
    const infoContent = document.getElementById('info-content');

    infoTitle.textContent = "Ad Campaign Selector";
    infoContent.textContent = "Click on any tile to see info about it.";

    infoBox.style.display = 'block';
    infoBox.style.backgroundColor = "#4CAF50";
    infoBox.style.color = TEXT_COLOR_LIGHT;
}