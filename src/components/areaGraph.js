import { useEffect, useRef } from 'react'
import { select } from 'd3-selection'
import { utcParse } from 'd3-time-format'
import * as d3 from 'd3'


// margin convention often used with D3
const margin = { top: 80, right: 60, bottom: 80, left: 60 }
const width = 600 - margin.left - margin.right
const height = 600 - margin.top - margin.bottom

const color = ['#f05440', '#d5433d', '#b33535', '#283250']

let week = utcParse("%Y-%m-%d %H:%M")
let weekNr = d3.utcFormat("%Y%V")
let parseWeek = utcParse("%Y%V")
//2023-03-02 07:01
const AreaGraph = ({ data }) => {

    console.log(data)
    const d3svg = useRef(null)
    const width = 928;
    const height = 500;
    const marginTop = 20;
    const marginRight = 30;
    const marginBottom = 30;
    const marginLeft = 40;

    useEffect(() => {
        if (data && d3svg.current) {
            let svg = select(d3svg.current)

            let numberedWeeks = data.map((d) => {
                d.weekNr = weekNr(week(d.Start))
                return d
            })

            let weeksCount = d3.rollup(numberedWeeks, (D) => D.length, (d) => d.weekNr)
            console.log(weeksCount)
            weeksCount = Array.from(weeksCount, ([key, value]) => ({key, value}))

            // List of groups = header of the csv files
            // var keys = numberedWeeks.columns.slice(1)
            let keys = ["Sleep"]

            // Add X axis
            const x = d3.scaleUtc(d3.extent(weeksCount, d => parseWeek(d.key)), [marginLeft, width - marginRight]);

            // Add Y axis
            const y = d3.scaleLinear([0, d3.max(weeksCount, d => d.value)], [height - marginBottom, marginTop]);

            // Add the x-axis.
            svg.append("g")
                .attr("transform", `translate(0,${height - marginBottom})`)
                .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0));

            // Add the y-axis, remove the domain line, add grid lines and a label.
            svg.append("g")
                .attr("transform", `translate(${marginLeft},0)`)
                .call(d3.axisLeft(y).ticks(height / 40))
                .call(g => g.select(".domain").remove())
                .call(g => g.selectAll(".tick line").clone()
                    .attr("x2", width - marginLeft - marginRight)
                    .attr("stroke-opacity", 0.1))
                .call(g => g.append("text")
                    .attr("x", -marginLeft)
                    .attr("y", 10)
                    .attr("fill", "currentColor")
                    .attr("text-anchor", "start")
                    .text("sleepy sleeps"));

            const area = d3.area()
                .x(d => x(parseWeek(d.key)))
                .y0(y(0))
                .y1(d => y(d.value))


            // Show the areas
            svg.append("path")
                .attr("fill", "steelblue")
                .attr("d", area(weeksCount))
        }
    }, [data])

    return (
        <svg
            className="streamgraph-container"
            width={width + margin.left + margin.right}
            height={height + margin.top + margin.bottom}
            role="img"
            ref={d3svg}
        ></svg>
    )
}

export default AreaGraph