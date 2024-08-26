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

export function addFakeChildren(node) {
    node.children.forEach(child => {
        if (child.children && child.children.length === 1 && !child.children.some(c => c.isFake)) {
            child.children.push({ name: "", value: child.children[0].value, isFake: true });
        }
        if (child.children) {
            addFakeChildren(child);
        }
    });
}

export function createMergedOutlinePath(d, adjustedArc) {
    const parent = d.parent;
    if (parent && parent.children.some(c => c.data.isFake)) {
        const mergedX0 = parent.x0;
        const mergedX1 = parent.x1;
        const arcGenerator = d3.arc()
            .startAngle(mergedX0)
            .endAngle(mergedX1)
            .innerRadius(d.y0)
            .outerRadius(d.y1);
        return arcGenerator(d);
    } else {
        return adjustedArc(d);
    }
}
