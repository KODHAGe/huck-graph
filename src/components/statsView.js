import React, { CSSProperties } from 'react'

import BarChart from './barChart'
import TreeMap from './treeMap'
import StreamGraph from './streamGraph'
import AreaGraph from './areaGraph'
import JacquardGraph from './jacquardGraph'
import FullAreaGraph from './fullAreaGraph'


import { tidy, filter, groupBy, summarize, count, arrange, rename, mutate, sliceHead, addRows} from '@tidyjs/tidy'


export default function tidyStats(csvData) {
    // Object to hold each type of huckleberry data -> implement fetching from different data parser functions here
    let splitData = {
        diaper:'',
        feed:'',
        solids:'',
        sleep:'',
        allFoods:''
    }

    if(csvData.csvData) {

        // get full csv from props
        const data = csvData.csvData

        // Diaper data parser
        splitData.diaper = tidy(
            data,
            filter((d) => d.Type === "Diaper")
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
        splitData.solids = splitData.solids.reduce((a, d) => {
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
        splitData.allFoods = splitData.solids
        splitData.allFoods = tidy(
            splitData.allFoods, 
            addRows(splitData.feed)
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

        console.log(splitData)
    }
    return (
        <div id="statsView">
            <h1>huckdata</h1>
            <span>amount of diapers: </span>{splitData.diaper.length}<br/>
            <span>amount of feedings: </span>{splitData.feed.length}<br/>
            <span>amount of solid feedings: </span>{splitData.solids.length}<br/>
            <span>amount of sleeps: </span>{splitData.sleep.length}<br/>
            {/*<BarChart data={splitData.feed.bottle}/>
            <BarChart data={splitData.solids.toplist}/>
            <AreaGraph data={splitData.sleep}/>
            
            <FullAreaGraph data={splitData.allFoods}/>*/}
            <JacquardGraph data={splitData.sleep}/>
            <StreamGraph data={splitData.allFoods}/>
        </div>
    );
}