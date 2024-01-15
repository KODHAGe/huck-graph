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
const StreamGraph = ({ data }) => {

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

            console.log(numberedWeeks)

            // Determine the series that need to be stacked.
            const series = d3.stack()
                .offset(d3.stackOffsetSilhouette)
                .order(d3.stackOrderInsideOut)
                .keys(d3.union(numberedWeeks.map(d => d["food"]))) // distinct series keys, in input order
                .value(([, D], key) => {
                    if(D.get(key)) {
                        return D.get(key)
                    } else {
                        return 0
                    }
                })
                (d3.rollup(numberedWeeks, (D) => D.length, (d) => d.weekNr, (d) => d["food"])); // group by stack then series key

            const x = d3.scaleUtc()
                .domain(d3.extent(numberedWeeks, d => parseWeek(d.weekNr)))
                .range([marginLeft, width - marginRight]);

            const y = d3.scaleLinear()
                .domain(d3.extent(series.flat(2)))
                .rangeRound([height - marginBottom, marginTop]);

            const color = d3.scaleOrdinal()
                .domain(series.map(d => d.key))
                .range(d3.schemeSet1);

            const area = d3.area()
                .x(d => x(parseWeek(d.data[0])))
                .y0(d => y(d[0]))
                .y1(d => y(d[1]))
                .curve(d3.curveBumpX)

            // Add the y-axis, remove the domain line, add grid lines and a label.
            svg.append("g")
                .attr("transform", `translate(${marginLeft},0)`)
                .call(d3.axisLeft(y).ticks(height / 80).tickFormat((d) => Math.abs(d).toLocaleString("en-US")))
                .call(g => g.select(".domain").remove())
                .call(g => g.selectAll(".tick line").clone()
                    .attr("x2", width - marginLeft - marginRight)
                    .attr("stroke-opacity", 0.1))
                .call(g => g.append("text")
                    .attr("x", -marginLeft)
                    .attr("y", 10)
                    .attr("fill", "currentColor")
                    .attr("text-anchor", "start")
                    .text("Feedings"));

            // Append the x-axis and remove the domain line.
            svg.append("g")
                .attr("transform", `translate(0,${height - marginBottom})`)
                .call(d3.axisBottom(x).tickSizeOuter(0))
                .call(g => g.select(".domain").remove());

            // Show the areas
            svg.append("g")
                .selectAll()
                .data(series)
                .join("path")
                .attr("fill", d => color(d.key))
                .attr("d", area)
                .append("title")
                .text(d => d.key);
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

export default StreamGraph