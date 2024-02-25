import "./Footer.css";

const Footer = ()=>{
    return(
        <div className="footer">
            <div className="top"></div>
            <div>
                <h1>Tsetse Control</h1>
                <p>Tsetse Fly Research</p>
            </div>
            <div>
                <a href="/"></a>
                <i className="fa-brands fa-facebook-square"></i>
                <a href="/"></a>
                <i className="fa-brands fa-instagram-square"></i>
                <a href="/"></a>
                <i className="fa-brands fa-snapchat-square"></i>
                <a href="/"></a>
                <i className="fa-brands fa-tiktok"></i>
            </div>

            <div className="bottom">
                <div>
                    <h4>Project</h4>
                    <a href="/">ChangeLog</a>
                    <a href="/">Status</a>
                    <a href="/">Licence</a>
                    <a href="/">All Versions</a>
                </div>
                <div>
                    <h4>Community</h4>
                    <a href="/">Github</a>
                    <a href="/">Issues</a>
                    <a href="/">Project</a>
                    
                </div>
                <div>
                    <h4>Others</h4>
                    <a href="/">Terms of Service</a>
                    <a href="/">Privacy Policy</a>
                    <a href="/">Licence</a>
                   
                </div>
                
            </div>
        </div>
        
    )
}
export default Footer;