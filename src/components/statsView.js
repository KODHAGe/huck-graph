import React, { CSSProperties } from 'react'

import BarChart from './barChart'
import TreeMap from './treeMap'
import StreamGraph from './streamGraph'
import AreaGraph from './areaGraph'
import JacquardGraph from './jacquardGraph'
import FullAreaGraph from './fullAreaGraph'
import BubbleChart from './bubbleChart'

import SectionSleep from './sectionSleep'
import SectionDrink from './sectionDrink'
import SectionFood from './sectionFood'
import SectionPoop from './sectionPoop'

import { timeDay, timeParse, timeFormat } from 'd3'

import './statsView.css'


import { tidy, filter, groupBy, summarize, count, arrange, rename, mutate, sliceHead, addRows} from '@tidyjs/tidy'

let time = timeParse("%Y-%m-%d %H:%M")
let format = timeFormat("%B %d, %Y")

export default function tidyStats(csvData) {
    // Object to hold each type of huckleberry data -> implement fetching from different data parser functions here
    let splitData = {
        diaper:'',
        feed:'',
        solids:'',
        sleep:'',
        allFoods:'',
        lastDate:'',
        firstDate:'',
        dateDiff:''
    }

    if(csvData.csvData) {

        // get full csv from props
        const data = csvData.csvData

        splitData.lastDate = time(data[0].Start)
        splitData.firstDate = time(data[data.length - 1].Start)
        splitData.dateDiff = timeDay.count(splitData.firstDate, splitData.lastDate)

        // Diaper data parser
        splitData.diaper = tidy(
            data,
            filter((d) => d.Type === "Diaper" || d.Type === "Potty")
        )

        //Feed data parser
        splitData.feed = tidy(
            data,
            filter((d) => d.Type === "Feed"),
            mutate({
                food: (d) => d["Start Location"].split(",")
            }),
            //rename({'End Condition': 'title'})
        )

        // Split each entry into its comp   onents (aka single foods)
        splitData.feed = splitData.feed.reduce((a, d) => {
            let flat = d.food.map((food) => {
                food = food.toLowerCase().trim()
                return { ...d, food}
            })
            return [...a, ...flat]
        }, [])

        splitData.feed.bottle = tidy(
            splitData.feed,
            filter((d) => d["Start Location"] === "Bottle"),
            groupBy('title', [
                summarize({ count: count("Start Location") })
            ]),
            arrange((a, b) => parseInt(b.title) - parseInt(a.title))
        )

        //Solids data parser
        splitData.solids = tidy(
            data,
            filter((d) => d.Type === "Solids"),
            mutate({
                food: (d) => d["Start Condition"].split(",")
            })
        )

        // Split each entry into its components (aka single foods)
        splitData.solids.split = splitData.solids.reduce((a, d) => {
            let flat = d.food.map((food) => {
                food = food.toLowerCase().trim()
                return { ...d, food}
            })
            return [...a, ...flat]
        }, [])

        splitData.solids.toplist = tidy(
            splitData.solids,
            groupBy('food', [
                summarize({count: count('food')})
            ]),
            arrange((a, b) => b.count[0].n - a.count[0].n),
            rename({'food': 'title'}),
            //sliceHead(50)
        )

        //Sleep data parser
        splitData.sleep = tidy(
            data,
            filter((d) => d.Type === "Sleep"),
            //filter((d) => d["Start"].includes('2024-01-01'))
        )

        // combined feeds and solids
        splitData.allFoods = splitData.solids.split
        splitData.allFoods = tidy(
            splitData.allFoods, 
            addRows(splitData.feed)
        )

        // counts of all food types
        splitData.allFoods.toplist = tidy(
            splitData.allFoods,
            groupBy('food', [
                summarize({count: count('food')})
            ]),
            arrange((a, b) => b.count[0].n - a.count[0].n),
            rename({'food': 'title'}),
        )

        /*
        splitData.allFoods = tidy(
            data,
            filter((d) => d.Type === "Feed" || d.Type === "Solids"),
            mutate({
                food: (d) => d["Start Condition"].split(",")
            })
        )

        splitData.allFoods = splitData.allFoods.reduce((a, d) => {
            let flat = d.food.map((food) => {
                food = food.toLowerCase().trim()
                return { ...d, food}
            })
            return [...a, ...flat]
        }, [])*/

    }
    return (
        <div id="statsView">
            { csvData.csvData &&
                <div>
                <p>Data parsed successfully, cool! Let's get started then.</p>
                <p>Looks like your data is from {format(splitData.firstDate)} until {format(splitData.lastDate)}. Does this seem correct? I am not actually checking the date ranges in the data, just picking the first and last entry so there might be some oddities here.</p>
                <p>Anyhow, thats a range of <span className="bold">{splitData.dateDiff}</span> days, quite impressive data gathering! In that time, you've recorded a total of <span className="bold">{csvData.csvData.length}</span> events.</p>
                <p>Thats and average of <span className="bold">{Math.round(csvData.csvData.length / splitData.dateDiff)}</span> events logged per day! Neat! </p>
                <p>Here's all of them in a graph: 
                    <span style={{color: "#17a2b8"}}> ●</span> sleep
                    <span style={{color: "#8fd33c"}}> ●</span> breastfeeding
                    <span style={{color: "#fd7e14"}}> ●</span> bottle feeding
                    <span style={{color: "#e83e8c"}}> ●</span> solid feeding
                    <span style={{color: "#ebb85f"}}> ●</span> diaper
                    <span style={{color: "#6c757d"}}> ●</span> potty
                    <span style={{color: "#6610f2"}}> ●</span> other
                </p>
                <JacquardGraph data={csvData.csvData} days={splitData.dateDiff}/>
                <p>To summarize that a bit, you've logged</p>
                <p>💩 <span className="bold">{splitData.diaper.length}</span> diaper and potty data points</p>
                <p>🍼 <span className="bold">{splitData.feed.length}</span> data points about liquid feedings</p>
                <p>🍎 <span className="bold">{splitData.solids.length}</span> entries about solids</p>
                <p>💤 <span className="bold">{splitData.sleep.length}</span> sleeps</p>
                <p>and <span className="bold">{csvData.csvData.length - (splitData.diaper.length + splitData.feed.length + splitData.solids.length + splitData.sleep.length)}</span> other events.</p>
                
                <p>Next, lets look at these a bit further.</p>
                <SectionFood data={splitData.allFoods} days={splitData.dateDiff} toplist={splitData.allFoods.toplist}></SectionFood>
                <SectionSleep data={splitData.sleep} days={splitData.dateDiff}></SectionSleep>
                <SectionPoop data={splitData.sleep} days={splitData.dateDiff}></SectionPoop>
                <SectionDrink data={splitData.sleep} days={splitData.dateDiff}></SectionDrink>
            </div>
            }
        </div>
    );
}

/*
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
*/