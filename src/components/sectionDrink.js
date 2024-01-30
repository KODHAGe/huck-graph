import JacquardGraph from "./jacquardGraph"

function SectionDrink(props) {
  return (
    <div id="SectionDrink">
        <h2>1.1 <span className="italic">Drink-weave</span></h2>
        <JacquardGraph data={props.data} days={props.days}/>
    </div>
  );
}

export default SectionDrink;
