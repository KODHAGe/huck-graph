import { useEffect, useRef } from 'react'
import { select } from 'd3-selection'
import { timeParse, timeFormat, utcParse, utcFormat } from 'd3-time-format'
import { utcHour, utcMinute } from 'd3-time'
import { max } from 'd3-array'
import { scaleLinear, scaleBand } from 'd3-scale'
import { axisLeft, axisBottom } from 'd3-axis'
import * as d3 from 'd3'

import { jsPDF } from 'jspdf'
import 'svg2pdf.js'

import './jacquardGraph.css'

// Margin convention often used with D3
const margin = { top: 80, right: 60, bottom: 80, left: 60 }

let time = timeParse("%Y-%m-%d %H:%M")
let format = timeFormat("%-I %p")

function formatHours(hours) {
    return format(new Date(hours * 1000 * 60 * 60))
}

let day = d3.timeDay

let formatDay = d3.timeFormat("%b")

let dateFormat = ({ month: "short", day: "numeric", hour: "numeric", minute: "numeric" })


const doc = new jsPDF({ format: 'a4', unit: 'px' })

function saveFile(svgref,width, height) {
    doc
    .svg(svgref.current, {
        x: -width/4,
        y: height/2,
        width: width,
        height: height
    })
    .then(() => {
        doc.save('myPDF.pdf')
    })
}

function hours(date) {
    //console.log(date)
    return date.getHours()
        + date.getMinutes() / 60
        + date.getSeconds() / (60 * 60)
        + date.getMilliseconds() / (60 * 60 * 1000);
}

const JacquardGraph = ({ data, days }) => {

    const dayHeight = 1;
    const dayMargin = 0;
    const d3svg = useRef(null)
    const width = 900;
    const height = days*(dayHeight + dayMargin);

    useEffect(() => {
        if (data && d3svg.current) {
            let svg = select(d3svg.current)

            let parsedTime = data.map((d) => {
                d.starttime = time(d.Start)
                if(d.End == "") {
                    d.endtime = utcMinute.offset(time(d.Start), 10)
                } else {
                    d.endtime = time(d.End)
                }
                return d
            })

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
            const x = d3.scaleTime()
                .domain([
                    d3.timeDay.floor(d3.min(parsedTime, d => d.starttime)),
                    d3.timeDay.ceil(d3.max(parsedTime, d => d.endtime))
                ])
                .rangeRound([0, width])
                //.nice()

            const y = d3.scaleLinear()
                .domain([0, 24])
                .rangeRound([0, height])
                
            const session = svg.append("g")
                .selectAll("g")
                .data(parsedTime)
                .join("g")
                .attr("fill", (d) => { 
                    if(d.Type === 'Sleep') {
                        return "#17a2b8"
                    } else if (d.Type === 'Feed') {
                        if(d["Start Location"] === "Breast") {
                            return "#8fd33c"
                        } else {
                            return "#fd7e14"
                        }
                    } else if (d.Type === 'Diaper') {
                        return "#ebb85f"
                    } else if (d.Type === 'Potty') {
                        return "#6c757d"
                    } else if (d.Type === 'Solids') {
                        return "#e83e8c"
                    } else {
                        return "#6610f2"
                    }
                })
                .on("mouseover", (event, d) => {
                    event.currentTarget.style.fill = "red"}
                    )
                .on("mouseout", (event) => event.currentTarget.style.fill = "")

            session.selectAll("rect")
                .data(dayslice)
                .join("rect")
                .attr("x", (d) => y(hours(d[0])))
                .attr("width", (d) => {
                    return y(hours(d[1]) || 24) - y(hours(d[0]))
                })
                .attr("y", (d) => x(day(d[0])))
                .attr("height", (d) => {
                    return dayHeight
                })
                .attr("rx", 1)

            /*session.append("title")
                .text((d) => `${d.starttime.toLocaleString("en", dateFormat)} →
            ${d.endtime.toLocaleString("en", dateFormat)}`);*/

        }
    }, [data, days])

    return (
    <>
    <svg
        className="jacquard-container"
        width="100%"
        //height={height + margin.top + margin.bottom}
        viewBox={"0 0 "+height+" 900"}
        preserveAspectRatio="xMidYMid meet" 
        role="img"
        ref={d3svg}
    ></svg>
    <button onClick={() => {
        saveFile(d3svg, 900, height)}}>Export as PDF (kinda broken for the time being)</button>
    </>
    )
}

export default JacquardGraph

/*
    --blue: #007487;
    --indigo: #6610f2;
    --purple: #6f42c1;
    --pink: #e83e8c;
    --red: #fb5d19;
    --orange: #fd7e14;
    --yellow: #ebb85f;
    --green: #8fd33c;
    --teal: #20c997;
    --cyan: #17a2b8;
    --white: #fff;
    --gray: #6c757d;
    --gray-dark: #343a40;
    --primary: #8fd33c;
    --secondary: #6c757d;
    --success: #8fd33c;
    --info: #17a2b8;
    --warning: #ebb85f;
    --danger: #fb5d19;
    --light: #f8f9fa;
    --dark: #343a40;
    */