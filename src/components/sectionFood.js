import BubbleChart from "./bubbleChart";
import StreamGraph from "./streamGraph";
import BarChart from "./barChart";

import { timeParse, timeFormat } from 'd3-time-format'
import { timeDay } from 'd3-time'
import { max, min } from 'd3-array'

let date = timeParse("%Y-%m-%d %H:%M")
let format = timeFormat("%B %d, %Y")

function oneCount(data) {
  return data.filter((d) => {
    return d.count[0].n === 1
  }).length
}

function sumSolid(data) {
  return data.reduce((a, b) => {
    return a + b.count[0].n
  }, 0)
}

function averageSolid(data) {
  let sum = sumSolid(data)
  let count = data.length
  return (sum/count).toFixed(2)
}

function filterSolids(data) {
  return data.filter(d => d["Type"] === "Solids")
}

function dateDeets(data) {
  let solids = filterSolids(data)
  let dates = solids.map((d) => {
    return date(d["Start"])
  })
  let dateMaths = {
    min: min(dates),
    max: max(dates),
    diff: timeDay.count(min(dates), max(dates))
  }
  return dateMaths
}

function minDate(data) {
  return format(dateDeets(data).min)
}

function maxDate(data) {
  return format(dateDeets(data).max)
}

function dateDiff(data) {
  return dateDeets(data).diff
}

function SectionFood(props) {
  //console.log(filterSolids(props.data))
  return (
    <div id="SectionFood" className="sectionStart">
        <p>
          Okay, so the food section will contain some overview of things eaten. 
          Your first solids seem to have gone down on {minDate(props.data)} ({filterSolids(props.data)[0].food}), 
          with the latest entries on {maxDate(props.data)} ({filterSolids(props.data)[filterSolids(props.data).length - 1].food}).
          Thats a <i>solid</i> <b>{dateDiff(props.data)}</b> days of solids.
          A total of <b>{props.solidtop.length}</b> solid foods have been at least taste-tested 
          which makes for an average of <b>{(props.solidtop.length/dateDiff(props.data)).toFixed(2)}</b> new foods per day, wow!
          On average, a single type of solid has been tasted <b>{averageSolid(props.solidtop)}</b> times and 
          only <b>{oneCount(props.solidtop)}</b> have been tried just once.
          
        </p>
        <BarChart data={props.solidtop} days={props.days}/>
        <h2>2.1. <span className="italic">You are what you eat</span></h2>
        <BubbleChart data={props.toplist} days={props.days}/>
        <h2>2.2. <span className="italic">Palate-complexity-stream</span></h2>
        <StreamGraph data={props.data} days={props.days} cumsum={false}/>
        <h2>2.3. <span className="italic">Cumulative complexity ratio</span></h2>
        <StreamGraph data={props.data} days={props.days} cumsum={true}/>
    </div>
  );
}

export default SectionFood;
