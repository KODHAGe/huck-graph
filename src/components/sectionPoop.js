import JacquardGraph from "./jacquardGraph"

function SectionPoop(props) {
  return (
    <div id="SectionPoop">
        <h2>3.1 <span className="italic">"Needs a name?"</span></h2>
        <JacquardGraph data={props.data} days={props.days}/>
    </div>
  );
}

export default SectionPoop;
