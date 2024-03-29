import { useEffect, useRef } from 'react'
import { select } from 'd3-selection'
import { utcParse } from 'd3-time-format'
import * as d3 from 'd3'


let week = utcParse("%Y-%m-%d %H:%M")
let weekNr = d3.utcFormat("%Y%V")
let parseWeek = utcParse("%Y%V")

const StreamGraph = ({ data, days, cumsum }) => {

    //console.log(data)

    let numberedWeeks = data.map((d) => {
        d.weekNr = weekNr(week(d.Start))
        return d
    })


    let weekRange = d3.timeWeek.count(parseWeek(numberedWeeks[numberedWeeks.length - 1].weekNr), parseWeek(numberedWeeks[0].weekNr))

    const d3svg = useRef(null)
    const width = 900;
    const dayHeight = 21;
    const height = weekRange * dayHeight

    useEffect(() => {
        if (data && d3svg.current) {
            let svg = select(d3svg.current)

            let options = {
                stroke: '',
                offset: '',
                order: '',
                series: ''
            }

            if(cumsum) {
                let rollup = d3.rollups(numberedWeeks, (D) => D.length, (d) => d.weekNr, (d) => d["food"])
                rollup = rollup.sort((a,b) => {
                    return a[0] - b[0]
                })
                let cumsumarray = []
                options.stroke = "0.5"
                options.offset = d3.stackOffsetExpand
                options.order = d3.stackOrderDescending
            
                rollup.forEach((d, k) => {
                    let thisWeek = [d[0], d[1]]
                    let mergeHolder = []
                    if(cumsumarray[k-1]) {
                        let lastWeek = cumsumarray[k-1]
                        mergeHolder.push([d[0], structuredClone(lastWeek[1])])
                        for(let z=0; z<thisWeek[1].length; z++) {
                            let index = lastWeek[1].findIndex(function(d) {
                                return d[0] === thisWeek[1][z][0]
                            })
                            if(index !== -1) {
                                mergeHolder[0][1][index][1] += thisWeek[1][z][1]
                            } else {
                                mergeHolder[0][1].push(thisWeek[1][z])
                            }
                        }
                        cumsumarray.push(mergeHolder[0])
                    } else {
                        cumsumarray.push([d[0], d[1]])
                    }
                })
                options.series = new d3.InternMap(cumsumarray.map((x) => {
                    return [x[0], new d3.InternMap(x[1])]
                }))
            } else {
                options.stroke = "2"
                options.offset = d3.stackOffsetSilhouette
                options.order = d3.stackOrderReverse
                options.series = d3.rollup(numberedWeeks, (D) => D.length, (d) => d.weekNr, (d) => d["food"])
            }

            const series = d3.stack()
                .offset(options.offset)
                .order(options.order)
                .keys(d3.union(numberedWeeks.map(d => d["food"])))
                .value(([, D], key) => {
                    console.log(D)
                    if (D.get(key)) {
                        return D.get(key)
                    } else {
                        return 0
                    }
                })
                (options.series)

            const y = d3.scaleUtc()
                .domain(d3.extent(numberedWeeks, d => parseWeek(d.weekNr)))
                .range([0, height]);

            const x = d3.scaleLinear()
                .domain(d3.extent(series.flat(2)))
                .range([0 + 30 , width - 30]);

            const color = d3.scaleOrdinal()
                //.domain(series.map(d => d.key))
                //.range(["#17a2b8","#8fd33c","#fd7e14","#ebb85f","#6c757d","#e83e8c","#6610f2"]);
                .range(["#845EC2","#D65DB1","#FF6F91","#FF9671","#FFC75F","#17a2b8"]);
                
            const area = d3.area()
                .y(d => y(parseWeek(d.data[0])))
                .x0(d => x(d[0]))
                .x1(d => x(d[1]))
                .curve(d3.curveBasisOpen)

            // Show the areas
            svg.append("g")
                .selectAll()
                .data(series)
                .join("path")
                .attr("fill", d => color(d.key))
                .attr("stroke", "rgb(232, 225, 239)")
                .attr("stroke-width", options.stroke)
                .attr("d", area)
                .append("title")
                .text(d => d.key);
        }
    }, [data, days])

    return (
        <svg
            className="streamgraph-container"
            width="100%" height={height}
            role="img"
            viewBox={"0 0 "+height+" 900"}
            preserveAspectRatio="xMidYMid meet"
            ref={d3svg}
        ></svg>
    )
}

export default StreamGraph