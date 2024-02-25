import { Component } from "react";
import "./Final.css";
import Human1 from '../Assets/image9.webp';
import Human2 from '../Assets/image10.webp';
import Human3 from '../Assets/image11.webp';

class FinalData extends Component{
    render(){
        return(
            <div className="first-des">
                <div className="des-text">
                    <h2>{this.props.heading}</h2>
                    <p><h3>Disease Transmission</h3>Tsetse flies are vectors for trypanosomes, the causative agents of diseases such as sleeping sickness in humans and nagana in animals.
                     Knowing the distribution of Tsetse fly species helps researchers identify regions at higher risk for disease transmission.</p>
                     <p><h3>Epidemiological Studies</h3>Mapping Tsetse fly distribution aids in conducting epidemiological studies to understand the prevalence and dynamics of trypanosome infections. 
                     This information is crucial for implementing targeted disease control strategies.</p>
                     <p><h3>Risk Assessment</h3>Identifying areas with a high concentration of Tsetse flies allows for risk assessment and prioritization of resources for disease surveillance and control efforts. 
                     It helps target interventions in regions most vulnerable to trypanosomiasis.</p>
                     <p><h3>Livestock Management</h3>Understanding Tsetse fly distribution is essential for livestock management, as nagana affects domesticated animals, causing economic losses in agriculture. 
                     Farmers can implement preventive measures in areas with a high presence of Tsetse flies.</p>
                     <p><h3>Vector Control Strategies</h3>Research on Tsetse fly distribution informs the development and implementation of vector control strategies. 
                     This includes the use of traps, insecticide-treated targets, and the identification of suitable habitats for larval control.</p>
                     <p><h3>Human Health Planning</h3>Mapping Tsetse fly distribution is essential for public health planning. 
                     It allows for the identification of areas where human populations are at risk of contracting sleeping sickness, enabling better allocation of healthcare resources.</p>
                     <div className="image">
                        <img alt="img" src={this.props.img1}/>
                        <img alt="img" src={this.props.img2}/>
                        <img alt="img" src={this.props.img3}/>

                     </div>
                </div>
                </div>


        )
    }
}
export default FinalData;