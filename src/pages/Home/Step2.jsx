import IndiaTable from "../../components/Tables/IndiaTable";
import ItalyTable from "../../components/Tables/ItalyTable";

const Step2 = ({
  currentRegion,
  setCurrentStep,
}) => {
  if (currentRegion === "Italy") {
    return (
      <ItalyTable
        setCurrentStep={setCurrentStep}
      />
    );
  } else {
    return <IndiaTable />;
  }
};

export default Step2;
