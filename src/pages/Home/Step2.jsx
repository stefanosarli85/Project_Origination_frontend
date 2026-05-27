import IndiaTable from "../../components/Tables/IndiaTable";
import ItalyTable from "../../components/Tables/ItalyTable";

const Step2 = ({ currentRegion }) => {
  if (currentRegion === "Italy") {
    return <ItalyTable />;
  } else {
    return <IndiaTable />;
  }
};

export default Step2;