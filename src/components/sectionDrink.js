import JacquardGraph from "./jacquardGraph"

function sumVolume(data) {
  // sums volume of drink in ml
  return filterType(data, "Bottle").reduce((a, b) => {
    return a + parseInt(b["End Condition"])
  }, 0)
}

function filterType(data, type) {
  return data.filter(d => d["Start Location"] === type)
}

function filterDrink(data, type) {
  return data.filter(d => d["Start Condition"] === type)
}

function sumDrinkVolumes(data) {
  const unique = [...new Set(filterType(data, "Bottle").map((item) => {
    return item["Start Condition"]
  }))]
  let counts = [];
  unique.forEach((element, i) => {
    counts[i] = { 'name': element }
    counts[i].value = filterDrink(data, element).reduce((a, b) => {
      return a + parseInt(b["End Condition"])
    }, 0)
  })
  console.log(counts)
  return counts
}

function sumTime(data) {
  console.log(filterType(data, "Breast"))
  return filterType(data, "Breast").reduce((a, b) => {
    return a + countMinutes(b["Duration"])
  }, 0)
}

function countMinutes(duration) {
  //format "hh:mm"
  let splittime = duration.split(":")
  let sum;
  sum = parseInt(splittime[0]) * 60 + parseInt(splittime[1])
  return sum
}

function SectionDrink(props) {
  console.log(props.data)
  return (
    <div id="SectionDrink" className="sectionStart">
      <p>The Drink section is all about liquid intake - the most important stuff for under one-year-olds.
        Summarizing this a bit, it looks like you've spent a total of <b>{(sumTime(props.data) / 60).toFixed(2)} hours</b> breastfeeding
        and drank a whole <b>{(sumVolume(props.data) / 1000).toFixed(2)} liters</b> from a bottle.
        And those bottles have contained {sumDrinkVolumes(props.data).map((obj, i) => <span key={i}><b>{(obj.value / 1000).toFixed(2)} liters </b> of {obj.name} </span>)}
      </p>
      <h2>1.1 <span className="italic">Drink-weave</span></h2>
      <JacquardGraph data={props.data} days={props.days} />
    </div>
  );
}

export default SectionDrink;
