import { useEffect, useRef } from 'react'
import { select } from 'd3-selection'
import { max } from 'd3-array'
import { scaleLinear, scaleBand } from 'd3-scale'
import { axisLeft, axisBottom } from 'd3-axis'
import * as d3 from 'd3'

// margin convention often used with D3
const margin = { top: 80, right: 60, bottom: 80, left: 60 }
const width = 600 - margin.left - margin.right
const height = 600 - margin.top - margin.bottom

const color = ['#f05440', '#d5433d', '#b33535', '#283250']

const TreeMap = ({ data }) => {

    console.log(data)
    const d3svg = useRef(null)

    useEffect(() => {
        if (data && d3svg.current) {
            let svg = select(d3svg.current)

            console.log(data)
            // scales
            const xMax = max(data, d => d.count[0].n)

            const xScale = scaleLinear()
                .domain([0, xMax])
                .range([0, width])

            const yScale = scaleBand()
                .domain(data.map(d => d["Start Condition"]))
                .rangeRound([0, height])
                .paddingInner(0.25)

            // append group translated to chart area
            svg = svg.append('g').attr('transform', `translate(${margin.left}, ${margin.top})`)

            // draw header
            svg
                .append('g')
                .attr('class', 'bar-header')
                .attr('transform', `translate(0, ${-margin.top / 2})`)
                .append('text')
                .append('tspan')
                .text('Treemap')

            let root = d3.hierarchy(data).sum(function (d) { 
                return d.value 
            })

            console.log(root)

            d3.treemap()
                .size([width, height])
                .paddingTop(28)
                .paddingRight(7)
                .paddingInner(3)      // Padding between each rectangle
                //.paddingOuter(6)
                //.padding(20)
                (root)

            // prepare a color scale
            var color = d3.scaleOrdinal()
                .domain(["boss1", "boss2", "boss3"])
                .range(["#402D54", "#D18975", "#8FD175"])

            // And an opacity scale
            var opacity = d3.scaleLinear()
                .domain([10, 30])
                .range([.5, 1])

            // use this information to add rectangles:
            svg
                .selectAll("rect")
                .data(root.leaves())
                .enter()
                .append("rect")
                .attr('x', function (d) { return d.x0; })
                .attr('y', function (d) { return d.y0; })
                .attr('width', function (d) { return d.x1 - d.x0; })
                .attr('height', function (d) { return d.y1 - d.y0; })
                .style("stroke", "black")
                //.style("fill", function (d) { return color(d.parent.data.name) })
                //.style("opacity", function (d) { return opacity(d.data.value) })

            // and to add the text labels
            svg
                .selectAll("text")
                .data(root.leaves())
                .enter()
                .append("text")
                .attr("x", function (d) { return d.x0 + 5 })    // +10 to adjust position (more right)
                .attr("y", function (d) { return d.y0 + 20 })    // +20 to adjust position (lower)
                .text(function (d) { return d.data.name.replace('mister_', '') })
                .attr("font-size", "19px")
                .attr("fill", "white")

            // and to add the text labels
            svg
                .selectAll("vals")
                .data(root.leaves())
                .enter()
                .append("text")
                .attr("x", function (d) { return d.x0 + 5 })    // +10 to adjust position (more right)
                .attr("y", function (d) { return d.y0 + 35 })    // +20 to adjust position (lower)
                .text(function (d) { console.log(d.data)
                    return d.data.count })
                .attr("font-size", "11px")
                .attr("fill", "white")

            // Add title for the 3 groups
            svg
                .selectAll("titles")
                .data(root.descendants().filter(function (d) { return d.depth == 1 }))
                .enter()
                .append("text")
                .attr("x", function (d) { return d.x0 })
                .attr("y", function (d) { return d.y0 + 21 })
                .text(function (d) { return d.data.count})
                .attr("font-size", "19px")
                .attr("fill", function (d) { return color(d.data.count) })

            // Add title for the 3 groups
            svg
                .append("text")
                .attr("x", 0)
                .attr("y", 14)    // +20 to adjust position (lower)
                .text("Three group leaders and 14 employees")
                .attr("font-size", "19px")
                .attr("fill", "grey")
        }
    }, [data])

    return (
        <svg
            className="treemap-container"
            width={width + margin.left + margin.right}
            height={height + margin.top + margin.bottom}
            role="img"
            ref={d3svg}
        ></svg>
    )
}

export default TreeMap