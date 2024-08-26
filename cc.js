import { chartData } from './data.js';
import { 
    BACKGROUND_COLOR, INCOMPATIBLE_COLOR, TEXT_COLOR_LIGHT, TEXT_COLOR_DARK,
    NORMAL_BORDER_COLOR, SELECTED_BORDER_COLOR, BORDER_WIDTH,
    getLighterShade, getHighlightShade, areIncompatible,
    addFakeChildren, createMergedOutlinePath
} from './utils.js';

const customColors = [
    "#DC143C",
    "#007BA7",
    "#32CD32",
    "#6A5ACD",
    "#D02090",
    "#FF8C00",
];

const color = d3.scaleOrdinal()
    .domain(chartData.children.map(d => d.name))
    .range(customColors);

const width = 1000;
const height = 1000;
const chartWidth = 800;
const chartHeight = 800;
const radius = Math.min(chartWidth, chartHeight) / 2;
const arrowRadius = radius + 10;

const svg = d3.select("#chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", `translate(${width / 2},${height / 2})`);

const chartGroup = svg.append("g").attr("class", "chart");

const partition = d3.partition()
    .size([2 * Math.PI, radius * 0.85]);

addFakeChildren(chartData);

const root = d3.hierarchy(chartData)
    .sum(d => d.value)
    .sort((a, b) => b.value - a.value);

partition(root);

function adjustedArc(d) {
    const arcGenerator = d3.arc()
        .startAngle(d.x0)
        .endAngle(d.x1)
        .innerRadius(d.y0)
        .outerRadius(d.y1);

    return arcGenerator(d);
}

const selectedItems = new Set();

function clickedInfo(event, p) {
    if (p.depth === 0) return;

    const baseColor = color(p.ancestors().find(node => node.depth === 1).data.name);
    const finalColor = getLighterShade(baseColor, p.depth - 1);

    const infoBox = document.getElementById('info-box');
    const infoTitle = document.getElementById('info-title');
    const infoContent = document.getElementById('info-content');

    infoTitle.textContent = p.data.name;
    infoContent.textContent = `This is information about ${p.data.name}. It belongs to the ${p.parent.data.name} category.`;
    
    infoBox.style.display = 'block';
    infoBox.style.backgroundColor = finalColor;
    infoBox.style.color = p.depth > 2 ? TEXT_COLOR_DARK : TEXT_COLOR_LIGHT;
}

function clickedSelect(event, p) {
    if (p.depth === 0) return;

    const parent = p.parent;

    if (parent && parent.children.some(c => c.data.isFake)) {
        if (parent.children.every(child => selectedItems.has(child))) {
            parent.children.forEach(child => selectedItems.delete(child));
        } else {
            parent.children.forEach(child => selectedItems.add(child));
        }
    } else {
        if (selectedItems.has(p)) {
            selectedItems.delete(p);
        } else {
            for (let item of selectedItems) {
                if (areIncompatible(item.data.name, p.data.name)) {
                    selectedItems.delete(item);
                }
            }
            selectedItems.add(p);
        }
    }

    updateColors();
}

function updateColors() {
    chartGroup.selectAll("path.segment")
        .transition()
        .duration(300)
        .attr("d", adjustedArc)
        .style("fill", d => {
            if (d.depth === 0) return BACKGROUND_COLOR;
            const baseColor = color(d.ancestors().find(node => node.depth === 1).data.name);
            let finalColor = getLighterShade(baseColor, d.depth - 1);

            if (selectedItems.has(d) || (d.parent && d.parent.children.some(c => selectedItems.has(c) && c.data.isFake))) {
                finalColor = getHighlightShade(finalColor);
            } else if (Array.from(selectedItems).some(selectedItem => areIncompatible(selectedItem.data.name, d.data.name))) {
                finalColor = INCOMPATIBLE_COLOR;
            }

            return finalColor;
        })
        .style("stroke", d => {
            if (d.data.isFake) return "none";
            const parent = d.parent;
            if (parent && parent.children.some(c => c.data.isFake)) {
                return "none";
            }
            return selectedItems.has(d) ? SELECTED_BORDER_COLOR : NORMAL_BORDER_COLOR;
        })
        .style("stroke-width", d => d.data.isFake ? 0 : BORDER_WIDTH);

    chartGroup.selectAll("path.outline").remove();

    selectedItems.forEach(d => {
        const parent = d.parent;
        if (parent && parent.children.some(c => c.data.isFake)) {
            chartGroup.append("path")
                .attr("d", createMergedOutlinePath(parent.children[0], adjustedArc))
                .attr("class", "outline")
                .style("fill", "none")
                .style("stroke", SELECTED_BORDER_COLOR)
                .style("stroke-width", BORDER_WIDTH);
        } else {
            chartGroup.append("path")
                .attr("d", createMergedOutlinePath(d, adjustedArc))
                .attr("class", "outline")
                .style("fill", "none")
                .style("stroke", SELECTED_BORDER_COLOR)
                .style("stroke-width", BORDER_WIDTH);
        }
    });

    chartGroup.selectAll("text")
        .attr("transform", function(d) {
            const x0 = d.x0;
            const x1 = d.x1;

            const isMerged = d.data.isFake || (d.parent && d.parent.children.some(c => c.data.isFake));
            if (isMerged) {
                const mergedX0 = d.parent.x0;
                const mergedX1 = d.parent.x1;
                const x = (mergedX0 + mergedX1) / 2 * 180 / Math.PI;
                const y = (d.y0 + d.y1) / 2;
                return `rotate(${x - 90}) translate(${y},0) rotate(${x < 180 ? 0 : 180})`;
            } else {
                const x = (x0 + x1) / 2 * 180 / Math.PI;
                const y = (d.y0 + d.y1) / 2;
                return `rotate(${x - 90}) translate(${y},0) rotate(${x < 180 ? 0 : 180})`;
            }
        })
        .style("fill", d => d.depth > 2 || selectedItems.has(d) ? TEXT_COLOR_DARK : TEXT_COLOR_LIGHT);
}

chartGroup.selectAll("path")
    .data(root.descendants())
    .enter()
    .append("path")
    .attr("class", "segment")
    .attr("d", adjustedArc)
    .style("fill", d => {
        if (d.depth === 0) return BACKGROUND_COLOR;
        const baseColor = color(d.ancestors().find(node => node.depth === 1).data.name);
        return getLighterShade(baseColor, d.depth - 1);
    })
    .style("stroke", d => d.data.isFake ? "none" : NORMAL_BORDER_COLOR)
    .style("stroke-width", d => d.data.isFake ? 0 : BORDER_WIDTH)
    .on("click", clickedInfo)
    .on("dblclick", clickedSelect)
    .append("title")
    .text(d => d.data.isFake ? "" : `${d.ancestors().map(d => d.data.name).reverse().join("/")}\n${d.value}`);

const label = chartGroup.selectAll("text")
    .data(root.descendants().filter(d => d.depth && d.data.name !== ""))
    .enter().append("text")
    .attr("transform", function(d) {
        const x0 = d.x0;
        const x1 = d.x1;

        const isMerged = d.data.isFake || (d.parent && d.parent.children.some(c => c.data.isFake));
        if (isMerged) {
            const mergedX0 = d.parent.x0;
            const mergedX1 = d.parent.x1;
            const x = (mergedX0 + mergedX1) / 2 * 180 / Math.PI;
            const y = (d.y0 + d.y1) / 2;
            return `rotate(${x - 90}) translate(${y},0) rotate(${x < 180 ? 0 : 180})`;
        } else {
            const x = (x0 + x1) / 2 * 180 / Math.PI;
            const y = (d.y0 + d.y1) / 2;
            return `rotate(${x - 90}) translate(${y},0) rotate(${x < 180 ? 0 : 180})`;
        }
    })
    .attr("dy", "0.35em")
    .on("click", clickedInfo)
    .on("dblclick", clickedSelect)
    .text(d => d.data.name)
    .style("font-size", "10px")
    .style("text-anchor", "middle")
    .style("fill", d => d.depth > 2 ? TEXT_COLOR_DARK : TEXT_COLOR_LIGHT)
    .attr("fill-opacity", 1);

const resetButton = svg.append("g")
    .attr("class", "reset-button")
    .attr("cursor", "pointer");

resetButton.append("circle")
    .attr("r", 30)
    .attr("fill", "#4CAF50");

resetButton.append("text")
    .attr("text-anchor", "middle")
    .attr("dy", "0.35em")
    .attr("fill", TEXT_COLOR_LIGHT)
    .style("font-size", "12px")
    .text("Reset");

resetButton.on("click", function() {
    selectedItems.clear();
    updateColors();
    document.getElementById('info-box').style.display = 'none';
});

function createShortCurvedArrow(startAngle, endAngle, clockwise) {
    const arrowGroup = svg.append("g").attr("class", "arrow");

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

    arrowGroup.append("path")
        .attr("d", arrowPath.toString())
        .attr("fill", "none")
        .attr("stroke", "#fff")
        .attr("stroke-width", 5)
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round");

    return arrowGroup;
}

function addArrow(centerAngle, arcLength, clockwise) {
    const halfArcLength = arcLength / 2;
    const startAngle = centerAngle - (clockwise ? halfArcLength : -halfArcLength);
    const endAngle = centerAngle + (clockwise ? halfArcLength : -halfArcLength);
    const arrow = createShortCurvedArrow(startAngle, endAngle, clockwise);

    arrow.on("mousedown", function(event) {
        event.preventDefault();
        startRotation(clockwise ? 1 : -1);
    });
}

const tenPercentOfCircle = Math.PI / 7;
addArrow(0, tenPercentOfCircle, true);
addArrow(Math.PI, tenPercentOfCircle, false);

let rotationInterval;

function startRotation(direction) {
    stopRotation();
    rotationInterval = setInterval(() => rotateChart(direction), 10);
}

function stopRotation() {
    clearInterval(rotationInterval);
}

function rotateChart(direction) {
    const currentRotation = parseFloat(chartGroup.attr("data-rotation") || 0);
    const newRotation = currentRotation + direction * 2;
    chartGroup.attr("data-rotation", newRotation).attr("transform", `rotate(${newRotation})`);
}

d3.select("body").on("mouseup", stopRotation);

d3.select("body").style("background-color", BACKGROUND_COLOR);

document.addEventListener('click', function(event) {
    if (!event.target.closest('#chart') && !event.target.closest('#info-box')) {
        document.getElementById('info-box').style.display = 'none';
    }
});