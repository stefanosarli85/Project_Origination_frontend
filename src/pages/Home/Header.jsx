import Stepper from "../../components/UI/Stepper";

const Header = ({ currentStep, currentRegion }) => {
  if (currentRegion === "" || currentRegion === "Italy") {
    return <Stepper currentStep={currentStep} />;
  }
};
export default Header;
