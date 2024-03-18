import "./Final.css";
import Human1 from "../Assets/image9.webp";
import Human2 from "../Assets/image10.webp";
import Human3 from "../Assets/image11.webp";
import FinalData from "./FinalData";
const Final = () => {
  return (
    <div className="final">
      <h1>Here's an Overview</h1>
      <p>
        Tsetse flies are large biting flies belonging to the genus Glossina.
        They are primarily found in sub-Saharan Africa and are known for
        transmitting a parasitic disease called trypanosomiasis, also known as
        sleeping sickness in humans and nagana in animals. Tsetse flies are
        unique in that they serve as both hosts and vectors for the parasitic
        protozoans of the genus Trypanosoma, which cause these diseases.
      </p>
      <FinalData
        heading="Why understand Tsetse Fly Species Distribution?"
        img1={Human1}
        img2={Human2}
        img3={Human3}
      />
    </div>
  );
};
export default Final;
