import { useEffect, useRef } from 'react'
import { select } from 'd3-selection'
import * as d3 from 'd3'

import './barChart.css'

// margin convention often used with D3
const margin = { top: 80, right: 60, bottom: 80, left: 60 }
let width = 900
const barWidth = 16
const height = 500 - margin.top - margin.bottom

const BarChart = ({ data }) => {

    const d3svg = useRef(null)
    width = data.length * barWidth + margin.left + margin.right

    useEffect(() => {


        const color = d3.scaleOrdinal()
            //.range(["#17a2b8","#8fd33c","#fd7e14","#ebb85f","#6c757d","#e83e8c","#6610f2"]);
            .range(["#845EC2", "#D65DB1", "#FF6F91", "#FF9671", "#FFC75F", "#17a2b8"]);

        if (data && d3svg.current) {
            let svg = select(d3svg.current)
            //data.length = 30

            const x = d3.scaleBand()
                .domain(d3.groupSort(data, ([d]) => -d.count[0].n, (d) => d.title))
                .range([margin.left, width - margin.right])
                .padding(0.1);

            const y = d3.scaleLinear()
                .domain([0, d3.max(data, (d) => {
                    //console.log(d.count[0].n)
                    return d.count[0].n
                })
                ])
                .range([height - margin.bottom, margin.top]);

            // make rects
            svg.append("g")
                .selectAll()
                .data(data)
                .join("rect")
                .attr("x", (d) => x(d.title))
                .attr("y", (d) => y(d.count[0].n))
                .attr("height", (d) => y(0) - y(d.count[0].n))
                .attr("width", barWidth + "px")
                .attr("fill", (d) => color(d.title))

                // make x axis
            svg.append("g")
                .attr("transform", `translate(0,${height - margin.bottom})`)
                .call(d3.axisBottom(x).tickSizeOuter(0))
                    .selectAll("text")
                    .attr("transform", "translate(-10,0)rotate(-45)")
                    .style("text-anchor", "end");


                // make y axis
            svg.append("g")
                .attr("transform", `translate(${margin.left},0)`)
                .call(d3.axisLeft(y).tickFormat((y) => y))
                .call(g => g.select(".domain").remove())
        }
    }, [data])

    return (
        <div className="scrollable-container">
            <svg
                className="barchart-container"
                width={width + margin.left + margin.right}
                height={height + margin.top + margin.bottom}
                role="img"
                ref={d3svg}
            ></svg>
        </div>
    )
}

export default BarChart