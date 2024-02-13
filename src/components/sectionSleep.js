import JacquardGraph from "./jacquardGraph";
function SectionSleep(props) {
  return (
    <div id="SectionSleep" className="sectionStart">
        <h2>3.1 The <span className="italic">"Sleep blanket"</span></h2>
        <JacquardGraph data={props.data} days={props.days}/>
    </div>
  );
}

export default SectionSleep;
