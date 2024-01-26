import JacquardGraph from "./jacquardGraph"

function SectionDrink(props) {
  return (
    <div id="SectionDrink">
        <JacquardGraph data={props.data} days={props.days}/>
    </div>
  );
}

export default SectionDrink;
