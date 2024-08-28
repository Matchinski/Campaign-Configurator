import { chartData } from './data.js';
import { 
    BACKGROUND_COLOR, INCOMPATIBLE_COLOR, TEXT_COLOR_LIGHT, TEXT_COLOR_DARK,
    NORMAL_BORDER_COLOR, SELECTED_BORDER_COLOR, BORDER_WIDTH,
    getLighterShade, getHighlightShade, areIncompatible,
    truncateText, getTileId,
    createShortCurvedArrow, showDefaultInfoPanel
} from './utils.js';

const customColors = [
    "#DC143C", "#007BA7", "#32CD32", "#6A5ACD", "#D02090", "#FF8C00",
];

const color = d3.scaleOrdinal()
    .domain(chartData.children.map(d => d.name))
    .range(customColors);

const width = 1000;
const height = 1000;
const chartWidth = 800;
const chartHeight = 800;
const radius = Math.min(chartWidth, chartHeight) / 2;
const arrowRadius = radius * 1.05; 

const svg = d3.select("#chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", `translate(${width / 2},${height / 2})`);

const chartGroup = svg.append("g").attr("class", "chart");

const partition = data => {
  const root = d3.hierarchy(data)
    .sum(d => d.value)
    .sort((a, b) => b.value - a.value);

  return d3.partition()
    .size([2 * Math.PI, radius * 0.85])
    .padding(0)(root);
};

const root = partition(chartData);

function arc(d) {
  return d3.arc()
    .startAngle(d.x0)
    .endAngle(d.x1)
    .innerRadius(d.y0)
    .outerRadius(d.y1)
    (d);
}

const selectedItems = new Set();

const EXPANSION_FACTOR = 1.2;

function expandTile(event, d) {
    if (d.children) return;

    const tileId = getTileId(d);
    const tile = d3.select(`#${tileId}`);
    const label = d3.select(`#label-${tileId}`);

    const arcGenerator = d3.arc()
        .startAngle(d.x0)
        .endAngle(d.x1)
        .innerRadius(d.y0)
        .outerRadius(d.y1 * EXPANSION_FACTOR);

    tile.transition().duration(200)
        .attr("d", arcGenerator);

    label.transition().duration(200)
        .attr("transform", function() {
            const angle = (d.x0 + d.x1) / 2;
            const radius = (d.y0 + d.y1 * EXPANSION_FACTOR) / 2;
            const x = Math.sin(angle) * radius;
            const y = -Math.cos(angle) * radius;
            const rotation = (angle * 180 / Math.PI - 90);
            return `translate(${x},${y}) rotate(${rotation})`;
        })
        .style("font-size", "12px")
        .text(d.data.name);
}

function contractTile(event, d) {
    if (d.children) return;

    const tileId = getTileId(d);
    const tile = d3.select(`#${tileId}`);
    const label = d3.select(`#label-${tileId}`);

    tile.transition().duration(200)
        .attr("d", arc);

    label.transition().duration(200)
        .attr("transform", function() {
            const angle = (d.x0 + d.x1) / 2;
            const radius = (d.y0 + d.y1) / 2;
            const x = Math.sin(angle) * radius;
            const y = -Math.cos(angle) * radius;
            const rotation = (angle * 180 / Math.PI - 90);
            return `translate(${x},${y}) rotate(${rotation})`;
        })
        .style("font-size", "10px")
        .text(d => truncateText(d.data.name, 15));
}

function clickedInfo(event, p) {
    if (p.depth === 0) return;

    const baseColor = color(p.ancestors().reverse()[1].data.name);
    const finalColor = getLighterShade(baseColor, p.depth - 1);

    const infoBox = document.getElementById('info-box');
    const infoTitle = document.getElementById('info-title');
    const infoContent = document.getElementById('info-content');

    infoTitle.textContent = p.data.name;
    infoContent.textContent = `This is information about ${p.data.name}. It belongs to the ${p.parent.data.name} category.`;

    infoBox.style.display = 'block';
    infoBox.style.backgroundColor = finalColor;
    infoBox.style.color = p.depth > 2 ? TEXT_COLOR_DARK : TEXT_COLOR_LIGHT;

    // Toggle expansion
    const tileId = getTileId(p);
    const tile = d3.select(`#${tileId}`);
    if (tile.classed("expanded")) {
        contractTile(event, p);
        tile.classed("expanded", false);
    } else {
        expandTile(event, p);
        tile.classed("expanded", true);
    }
}

function clickedSelect(event, p) {
    event.preventDefault();
    event.stopPropagation();
    if (p.depth === 0) return;

    toggleSelection(p);
}

function toggleSelection(p) {
    const isSelected = selectedItems.has(p);

    if (isSelected) {
        selectedItems.delete(p);
    } else {
        selectedItems.forEach(item => {
            if (areIncompatible(item.data.name, p.data.name)) {
                selectedItems.delete(item);
            }
        });
        selectedItems.add(p);
    }

    updateColors();
    updateSearchResults();

    // Update info box
    clickedInfo(null, p);

    // Center the selected tile
    const angle = (p.x0 + p.x1) / 2 * 180 / Math.PI - 90;
    chartGroup.transition()
        .duration(750)
        .attr("transform", `rotate(${-angle})`);
}

function updateColors() {
    chartGroup.selectAll("path.segment")
        .style("fill", d => {
            if (d.depth === 0) return BACKGROUND_COLOR;
            const baseColor = color(d.ancestors().reverse()[1].data.name);
            let finalColor = getLighterShade(baseColor, d.depth - 1);

            if (selectedItems.has(d)) {
                finalColor = getHighlightShade(finalColor);
            } else if (Array.from(selectedItems).some(selectedItem => areIncompatible(selectedItem.data.name, d.data.name))) {
                finalColor = INCOMPATIBLE_COLOR;
            }

            return finalColor;
        })
        .each(function(d) {
            const isSelected = selectedItems.has(d);
            d3.select(this)
                .style("stroke", isSelected ? SELECTED_BORDER_COLOR : NORMAL_BORDER_COLOR)
                .style("stroke-width", isSelected ? BORDER_WIDTH * 2 : BORDER_WIDTH)
                .style("stroke-linejoin", "round")
                .style("stroke-linecap", "round");
        });

    chartGroup.selectAll("text.node-label")
        .style("fill", d => d.depth > 2 || selectedItems.has(d) ? TEXT_COLOR_DARK : TEXT_COLOR_LIGHT);
}

function drawChart() {
    chartGroup.selectAll("path")
        .data(root.descendants().slice(1))
        .enter()
        .append("path")
        .attr("class", "segment")
        .attr("id", d => getTileId(d))
        .attr("d", arc)
        .style("fill", d => {
            const baseColor = color(d.ancestors().reverse()[1].data.name);
            return getLighterShade(baseColor, d.depth - 1);
        })
        .style("stroke", NORMAL_BORDER_COLOR)
        .style("stroke-width", BORDER_WIDTH)
        .style("stroke-linejoin", "round")
        .style("stroke-linecap", "round")
        .on("click", clickedInfo)
        .on("dblclick", clickedSelect)
        .on("mouseover", expandTile)
        .on("mouseout", contractTile);

    chartGroup.selectAll("text")
        .data(root.descendants().slice(1).filter(d => (d.y1 - d.y0) / (2 * Math.PI) * radius > 10))
        .enter().append("text")
        .attr("class", "node-label")
        .attr("id", d => `label-${getTileId(d)}`)
        .attr("transform", d => {
            const angle = (d.x0 + d.x1) / 2;
            const radius = (d.y0 + d.y1) / 2;
            const x = Math.sin(angle) * radius;
            const y = -Math.cos(angle) * radius;
            const rotation = (angle * 180 / Math.PI - 90);
            return `translate(${x},${y}) rotate(${rotation})`;
        })
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "middle")
        .style("font-size", "9px")
        .style("fill", d => d.depth > 2 ? TEXT_COLOR_DARK : TEXT_COLOR_LIGHT)
        .style("pointer-events", "none")
        .text(d => truncateText(d.data.name, 17));
}

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

resetButton.on("click", function(event) {
    event.preventDefault();
    selectedItems.clear();
    updateColors();
    showDefaultInfoPanel();

    chartGroup.attr("data-rotation", 0).attr("transform", "rotate(0)");

    chartGroup.selectAll("*").remove();
    drawChart();
    updateSearchResults();
});

function addArrow(centerAngle, arcLength, clockwise) {
    const halfArcLength = arcLength / 2;
    const startAngle = centerAngle - (clockwise ? halfArcLength : -halfArcLength);
    const endAngle = centerAngle + (clockwise ? halfArcLength : -halfArcLength);
    const arrowPath = createShortCurvedArrow(startAngle, endAngle, clockwise, arrowRadius);

    const arrow = svg.append("g")
        .attr("class", "arrow")
        .attr("cursor", "pointer");

    arrow.append("path")
        .attr("d", arrowPath)
        .attr("fill", "none")
        .attr("stroke", "#fff")
        .attr("stroke-width", 5)
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round");

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

showDefaultInfoPanel();

drawChart();

document.addEventListener('click', function(event) {
    if (!event.target.closest('#chart') && !event.target.closest('#info-box')) {
        showDefaultInfoPanel();
    }
});

document.addEventListener('mousedown', function(event) {
    if (event.detail > 1) {
        event.preventDefault();
    }
}, false);

function searchTiles(searchTerm) {
    const normalizedSearchTerm = searchTerm.toLowerCase().trim();
    const searchResults = [];
    
    if (normalizedSearchTerm === '') {
        displaySearchResults([]); 
        return;
    }
    
    chartGroup.selectAll("path.segment")
        .classed("highlighted", false)
        .each(function(d) {
            const tileName = d.data.name.toLowerCase();
            if (tileName.includes(normalizedSearchTerm)) {
                d3.select(this).classed("highlighted", true);
                searchResults.push(d);
            }
        });
    
    displaySearchResults(searchResults);
}

function displaySearchResults(results) {
    const searchResultsContainer = document.getElementById('search-results');
    searchResultsContainer.innerHTML = '';

    if (results.length === 0 && document.getElementById('search-input').value.trim() !== '') {
        searchResultsContainer.innerHTML = '<p>No results found.</p>';
        return;
    }

    if (results.length > 0) {
        const resultsList = document.createElement('ul');
        results.forEach(result => {
            const listItem = document.createElement('li');
            listItem.textContent = result.data.name;
            listItem.classList.add('search-result');
            if (selectedItems.has(result)) {
                listItem.classList.add('selected');
            }
            listItem.addEventListener('click', () => focusOnTile(result));
            listItem.addEventListener('dblclick', (event) => {
                event.preventDefault();
                toggleSelection(result);
            });
            resultsList.appendChild(listItem);
        });

        searchResultsContainer.appendChild(resultsList);
    }
}

function focusOnTile(d) {
    chartGroup.selectAll("path.segment")
        .classed("highlighted", false);
    
    const tileId = getTileId(d);
    const tile = d3.select(`#${tileId}`);
    tile.classed("highlighted", true);

    expandTile(null, d);

    clickedInfo(null, d);

    const angle = (d.x0 + d.x1) / 2 * 180 / Math.PI - 90;
    chartGroup.transition()
        .duration(750)
        .attr("transform", `rotate(${-angle})`);
}

function updateSearchResults() {
    const searchInput = document.getElementById('search-input');
    searchTiles(searchInput.value);
}

const searchInput = document.getElementById('search-input');
searchInput.addEventListener('input', function() {
    searchTiles(this.value);
});

updateSearchResults();