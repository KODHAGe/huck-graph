import BubbleChart from "./bubbleChart";
import StreamGraph from "./streamGraph";

function SectionFood(props) {
    console.log(props)
  return (
    <div id="SectionFood">
        <p>Food section</p>
        <BubbleChart data={props.toplist} days={props.days}/>
        <StreamGraph data={props.data} days={props.days}/>
    </div>
  );
}

export default SectionFood;
