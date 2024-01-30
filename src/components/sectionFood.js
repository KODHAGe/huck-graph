import BubbleChart from "./bubbleChart";
import StreamGraph from "./streamGraph";
import BarChart from "./barChart";

function SectionFood(props) {
    console.log(props)
  return (
    <div id="SectionFood">
        <h2>2.1 <span className="italic">You are what you eat</span></h2>
        {/*<BarChart data={props.toplist} days={props.days}/>*/}
        <BubbleChart data={props.toplist} days={props.days}/>
        <h2>2.2 <span className="italic">Palate-complexity-stream</span></h2>
        <StreamGraph data={props.data} days={props.days}/>
    </div>
  );
}

export default SectionFood;
