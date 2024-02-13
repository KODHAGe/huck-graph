import JacquardGraph from "./jacquardGraph"
import FullAreaGraph from "./fullAreaGraph";

function SectionPoop(props) {
  return (
    <div id="SectionPoop"  className="sectionStart">
        <p>In the section of outputs</p>
        <h2>3.1 <span className="italic">Output butte</span></h2>
        <p>The passage of time, wandering through the hoodoo valleys of output-ratios. The data is condensed weekly.</p>
        <FullAreaGraph data={props.data} days={props.days}></FullAreaGraph>
        <h2>3.2 <span className="italic">Speckles</span></h2>
        <JacquardGraph data={props.data} days={props.days}/>
    </div>
  );
}

export default SectionPoop;
