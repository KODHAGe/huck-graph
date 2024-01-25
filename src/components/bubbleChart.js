import { useEffect, useRef } from 'react'
import { select } from 'd3-selection'
import { utcParse } from 'd3-time-format'
import * as d3 from 'd3'


const BubbleChart = ({ data, days }) => {

    const width = 928;
    const height = width;
    const margin = 1; // to avoid clipping the root circle stroke
    const d3svg = useRef(null)

    // Specify the number format for values.
    const format = d3.format(" d");

    // Create a categorical color scale.
    const color = d3.scaleOrdinal()
    //.range(["#17a2b8","#8fd33c","#fd7e14","#ebb85f","#6c757d","#e83e8c","#6610f2"]);
    .range(["#845EC2","#D65DB1","#FF6F91","#FF9671","#FFC75F","#F9F871"]);

    // Create the pack layout.
    const pack = d3.pack()
        .size([width - margin * 2, height - margin * 2])
        .padding(3);

    // Compute the hierarchy from the (flat) data; expose the values
    // for each node; lastly apply the pack layout.

    console.log(data)
    const root = pack(d3.hierarchy({children: data})
        .sum((d) => {
            //console.log(d)
            if(d.count) {
                return d.count[0].n
            } else {
                return 0
            }
            
        }
            ));

    useEffect(() => {
        if (data && d3svg.current) {
            let svg = select(d3svg.current)
            console.log(root)

            const node = svg.append("g")
            .selectAll()
            .data(root.leaves())
            .join("g")
              .attr("transform", (d) => {
                //console.log(d)
                return `translate(${d.x},${d.y})`
              });

            // Add a title.
            node.append("title")
            .text(d => `${d.data.id}\n${format(d.value)}`);

            // Add a filled circle.
            node.append("circle")
            .attr("fill-opacity", 0.7)
            .attr("fill", (d) => {
                //console.log(d)
                return color(d.data.title)
            })
            .attr("r", d => d.r);

            
            const text = node.append("text")
            .attr("clip-path", d => `circle(${d.r})`);
            
            text.append("tspan")
            /*.attr("x", d => `-${d.data.title.length / 4}em`)
            .attr("y", d => `${0.5}em`)*/
            .attr('text-anchor', 'middle')
            .attr('alignment-baseline', 'central')
            .attr("fill-opacity", 0.7)
            .text((d) => {
                if (d.data.count[0].n < 15 || d.data.title.length > 9) {
                    return ""
                } else {
                    return d.data.title
                }
            });
            
            
        }
    }, [data, days])

    return (
        <svg
            className="bubblechart-container"
            width="100%" height={height}
            role="img"
            viewBox={"0 0 "+height+" 900"}
            preserveAspectRatio="xMidYMid meet"
            ref={d3svg}
        ></svg>
    )
}

export default BubbleChart