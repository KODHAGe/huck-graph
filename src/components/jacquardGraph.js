import { useEffect, useRef } from 'react'
import { select } from 'd3-selection'
import { timeParse, timeFormat, utcParse, utcFormat } from 'd3-time-format'
import { max } from 'd3-array'
import { scaleLinear, scaleBand } from 'd3-scale'
import { axisLeft, axisBottom } from 'd3-axis'
import * as d3 from 'd3'

import './jacquardGraph.css'

// Margin convention often used with D3
const margin = { top: 80, right: 60, bottom: 80, left: 60 }
const color = ['#f05440', '#d5433d', '#b33535', '#283250']

let time = timeParse("%Y-%m-%d %H:%M")
let format = timeFormat("%-I %p")

function formatHours(hours) {
    return format(new Date(hours * 1000 * 60 * 60))
}

let day = d3.timeDay

let formatDay = d3.timeFormat("%b")

let dateFormat = ({ month: "short", day: "numeric", hour: "numeric", minute: "numeric" })

function hours(date) {
    //console.log(date)
    return date.getHours()
        + date.getMinutes() / 60
        + date.getSeconds() / (60 * 60)
        + date.getMilliseconds() / (60 * 60 * 1000);
}

const JacquardGraph = ({ data }) => {

    console.log(data)
    const d3svg = useRef(null)
    const width = 928;
    const height = 1900;
    const marginTop = 20;
    const marginRight = 30;
    const marginBottom = 30;
    const marginLeft = 40;
    useEffect(() => {
        if (data && d3svg.current) {
            let svg = select(d3svg.current)

            let parsedTime = data.map((d) => {
                d.starttime = time(d.Start)
                d.endtime = time(d.End)
                return d
            })
            console.log(parsedTime)

            function dayslice(d) {
                let startDay = day(d.starttime)
                let endDay = day(d.endtime)
                let slices = []
                while (startDay < endDay) {
                    startDay = day.offset(startDay)
                    slices.push([d.starttime, startDay])
                    d.starttime = startDay
                }
                if (d.starttime < d.endtime) {
                    slices.push([d.starttime, d.endtime])
                }
                return slices
            }

            // Set scales
            const x = d3.scaleTime() // Change to d3.scaleTime()
                .domain([
                    d3.timeDay.floor(d3.min(parsedTime, d => d.starttime)),
                    d3.timeDay.ceil(d3.max(parsedTime, d => d.endtime))
                ])
                .rangeRound([margin.left, width - margin.right])
                //.nice()

            const y = d3.scaleLinear() // Change to d3.scaleLinear()
                .domain([0, 24])
                .rangeRound([margin.top, height - margin.bottom])

            svg.append("g")
                //.attr("transform", `translate(0,${margin.top})`)
                .call(d3.axisLeft(x)
                    //.tickFormat(formatDay)
                    .tickPadding(0))
                //.call(g => g.select(".domain").remove())
                .call(g => g.selectAll(".tick text")
                    .attr("text-anchor", "start")
                    .attr("x", 6)
                    .attr("dy", null))
                .call(g => g.selectAll(".tick line")
                    .attr("y1", -margin.top)
                    .attr("y2", height - margin.top))

            svg.append("g")
                .attr("transform", `translate(0,${margin.left})`)
                .call(d3.axisTop(y)
                    .ticks(24)
                    .tickSize(-width + margin.left + margin.right)
                    .tickPadding(10))
                //.call(g => g.selectAll(".domain, .tick:first-of-type, .tick:last-of-type").remove())
                .call(g => g.selectAll(".domain").attr("stroke", "#000").attr("stroke-width", 5))

            const session = svg.append("g")
                .attr("fill", "#333")
                .selectAll("g")
                .data(parsedTime)
                .join("g")
                .on("mouseover", (event, d) => {
                    console.log(d)
                    event.currentTarget.style.fill = "red"}
                    )
                .on("mouseout", (event) => event.currentTarget.style.fill = "")

            session.selectAll("rect")
                .data(dayslice)
                .join("rect")
                .attr("x", (d) => y(hours(d[0]))) // Swap x and y
                .attr("width", (d) => y(hours(d[1]) || 24) - y(hours(d[0]))) // Swap x and y
                .attr("y", (d) => x(day(d[0])))
                .attr("height", 1)
                .attr("rx", 1)

            /*session.append("title")
                .text((d) => `${d.starttime.toLocaleString("en", dateFormat)} →
            ${d.endtime.toLocaleString("en", dateFormat)}`);*/

        }
    }, [data])

    return (
        <svg
            className="jacquard-container"
            width="100%"
            height={height + margin.top + margin.bottom}
            viewBox={"0 0 "+height+" 540"}
            preserveAspectRatio="xMidYMid meet" 
            role="img"
            ref={d3svg}
        ></svg>
    )
}

export default JacquardGraph
