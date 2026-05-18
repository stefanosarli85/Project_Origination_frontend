import Italy from "../../components/Filters/Italy";
import IndiaTable from "../../components/Tables/IndiaTable";

const Step2 = ({ onNext, currentRegion }) => {
  if (currentRegion === "Italy") {
    return <Italy onNext={onNext} />;
  } else {
    return <IndiaTable />;
  }
};
export default Step2;
