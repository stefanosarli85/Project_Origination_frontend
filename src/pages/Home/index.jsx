import { useEffect, useState } from "react";
import Header from "./Header";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";

const Home = () => {
const [currentStep, setCurrentStep] = useState(
  Number(sessionStorage.getItem("currentStep")) || 1
);

const [currentRegion, setCurrentRegion] = useState(
  sessionStorage.getItem("currentRegion") || ""
);
// useEffect(() => {
//   if (currentStep === 2 && currentRegion === "Italy") {
//     setTimeout(() => {
//       sessionStorage.removeItem("currentStep");
//       sessionStorage.removeItem("currentRegion");
//     }, 1000);
//   }
// }, [currentStep, currentRegion]);
  const handleNext = (porops) => {
    setCurrentRegion(porops);
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  return (
    <>
      <Header currentStep={currentStep} currentRegion={currentRegion} />
      <div className="container-fluid px-lg-5 px-3 py-5">
        {currentStep === 1 && (
          <Step1 onNext={handleNext} currentRegion={currentRegion} />
        )}
        {currentStep === 2 && (
          <Step2
  onNext={handleNext}
  currentRegion={currentRegion}
/>
        )}
        {currentStep === 3 && <Step3 currentRegion={currentRegion} />}
      </div>
    </>
  );
};

export default Home;
