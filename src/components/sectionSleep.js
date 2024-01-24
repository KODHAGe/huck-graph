import JacquardGraph from "./jacquardGraph";
function SectionSleep(props) {
  return (
    <div id="SectionSleep">
        <p>Sleep section</p>
        <JacquardGraph data={props.data} days={props.days}/>
    </div>
  );
}

export default SectionSleep;
