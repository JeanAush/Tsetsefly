import './HelpForm.css';

function HelpForm(){
    return(
        <div className="help-page-container">
        <h2>Help and Support</h2>

        <h3>Frequently Asked Questions (FAQs)</h3>
        <p>
          <strong>Q: How do I upload tsetse fly data?</strong>
          <br />
          A: To upload tsetse fly data, go to the Map Page and use the provided CSV upload button. Select your CSV file containing the required data fields, and the system will process and display the information on the map.
        </p>

        <p>
          <strong>Q: Can I filter the data based on specific criteria?</strong>
          <br />
          A: Yes, you can filter the tsetse fly data based on various criteria such as species, country, season, and trap method. Use the filtering options on the Map Page to customize your data visualization.
        </p>

        <p>
          <strong>Q: How do I create a user account?</strong>
          <br />
          A: To create a user account, click on the Login button in the navigation bar. From the login page, there will be an option to register and create a new account. Once registered, you can log in to access your saved data.
        </p>

        <h3>Contact Us</h3>
        <p>
          If you have any additional questions or require further assistance, please feel free to contact the support system at <a href="mailto:natwolijean@gmail.com">natwolijean@gmail.com</a>.
        </p>

        <p>
          Thank you for using the TseTse distribution System!
        </p>
      </div>
    )
}
export default HelpForm;