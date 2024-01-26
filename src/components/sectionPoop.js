import JacquardGraph from "./jacquardGraph"

function SectionPoop(props) {
  return (
    <div id="SectionPoop">
        <JacquardGraph data={props.data} days={props.days}/>
    </div>
  );
}

export default SectionPoop;
