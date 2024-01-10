import { useEffect, useRef } from 'react'
import { select } from 'd3-selection'
import { max } from 'd3-array'
import { scaleLinear, scaleBand } from 'd3-scale'
import { axisLeft, axisBottom } from 'd3-axis'

// margin convention often used with D3
const margin = { top: 80, right: 60, bottom: 80, left: 60 }
const width = 600 - margin.left - margin.right
const height = 600 - margin.top - margin.bottom

const color = ['#f05440', '#d5433d', '#b33535', '#283250']

const JacquardGraph = ({ data }) => {

    console.log(data)
    const d3svg = useRef(null)

    useEffect(() => {
        if (data && d3svg.current) {
            let svg = select(d3svg.current)
        }
    }, [data])

    return (
        <svg
            className="barchart-container"
            width={width + margin.left + margin.right}
            height={height + margin.top + margin.bottom}
            role="img"
            ref={d3svg}
        ></svg>
    )
}

export default JacquardGraph