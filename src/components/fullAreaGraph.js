import { useEffect, useRef } from 'react'
import { select } from 'd3-selection'
import { utcParse } from 'd3-time-format'
import * as d3 from 'd3'


// margin convention often used with D3
const margin = { top: 80, right: 60, bottom: 80, left: 60 }
const width = 600 - margin.left - margin.right
const height = 600 - margin.top - margin.bottom

let week = utcParse("%Y-%m-%d %H:%M")
let weekNr = d3.utcFormat("%Y%V")
let parseWeek = utcParse("%Y%V")
//2023-03-02 07:01
const FullAreaGraph = ({ data }) => {

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

            //console.log(numberedWeeks)
            const fixedOrder = ['Potty', 'Dry', 'Pee', 'Both', 'Poo'];

            // Determine the series that need to be stacked.
            const series = d3.stack()
                .offset(d3.stackOffsetExpand)
                .order((D) => {
                    let order = fixedOrder
                    D.forEach((d,i) => {
                        order[order.indexOf(d.key)] = i
                    })
                    return order.reverse()
                })
                .keys(d3.union(numberedWeeks.map((d) => {
                    let str = d["End Condition"].toLowerCase()

                    if(d["Type"] === "Potty") {
                        return "Potty"
                    } else if(str.includes("both")) {
                        return "Both"
                    } else if (str.includes("pee")) {
                        return "Pee"
                    } else if (str.includes("poo")) {
                        return "Poo"
                    } else {
                        return d["End Condition"]
                    }
                }))) // distinct series keys, in input order
                .value(([, D], key) => {
                    if(D.get(key)) {
                        return D.get(key)
                    } else {
                        return 0
                    }
                })
                (d3.rollup(numberedWeeks, (D) => D.length, (d) => d.weekNr, (d) => {
                    let str = d["End Condition"].toLowerCase()
                    if(d["Type"] === "Potty") {
                        return "Potty"
                    } else if(str.includes("both")) {
                        return "Both"
                    } else if (str.includes("pee")) {
                        return "Pee"
                    } else if (str.includes("poo")) {
                        return "Poo"
                    } else {
                        return d["End Condition"]
                    }
                })); // group by stack then series key
            const x = d3.scaleUtc()
                .domain(d3.extent(numberedWeeks, d => parseWeek(d.weekNr)))
                .range([8, width - 8]);

            const y = d3.scaleLinear()
                .domain(d3.extent(series.flat(2)))
                .rangeRound([height - marginBottom, marginTop]);

            const area = d3.area()
                .x(d => x(parseWeek(d.data[0])))
                .y0(d => y(d[0]))
                .y1(d => y(d[1]))
                .curve(d3.curveBumpX)

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
                .attr("fill",(d) => {
                    let str = d.key.toLowerCase()
                    if(d.key === "Potty") {
                        return "#81D8D0"
                    } else if(str.includes("both")) {
                        return "#B87333"
                    } else if (str.includes("pee")) {
                        return "#E1C16E"
                    } else if (str.includes("poo")) {
                        return "#6F4E37"
                    } else {
                        return "#cccccc"
                    }
                })
                .attr("d", area)
                .append("title")
                .text(d => d.key);
        }
    }, [data])

    return (
        <svg
            className="fullareagraph-container"
            width={width + margin.left + margin.right}
            height={height + margin.top + margin.bottom}
            role="img"
            ref={d3svg}
        ></svg>
    )
}

export default FullAreaGraph