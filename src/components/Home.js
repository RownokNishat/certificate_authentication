import React, { Component } from 'react';
import img1 from "../certificate.svg";
import bg1 from "../bg.jpg"
import ab1 from "../about.png"


class Home extends Component {
    render() {
        return (
        <div>
            <div class="row my-5 mx-auto" style={{ backgroundImage: `url(${bg1})` ,
                                                            opacity: '80%',
                                                            backgroundSize: 'cover',
                                                            width:'100%', height: '500px'}}>
                <div class="col-lg-12 py-5 text-align-center" style={{background: 'rgba(0, 0, 0, 0.1)',
                                                                    display: 'flex',
                                                                    justifyContent: 'center',
                                                                    alignItems: 'center',
                                                                    textShadowColor:'#585858',}}>
                    <h1 class="my-auto text-white text-align-center" style={{background: 'rgba(0, 0, 0, 0.2)'}}>
                        Certificate Authentication
                        <p style={{fontSize:'15px'}}>Ensures traceability, 
                        ownership, accessibility, availability and integrity of the certificate</p>
                    </h1>
                    
                </div>
            </div>
            {/*//////////////////////////////////////////////////////////////////////////// */}
            <div class="row my-5 d-flex container mx-auto">
                    <div class="col-lg-7 my-5 text-center">
                        <h1>Certificate Authentication</h1>
                        <p>&nbsp;</p>
                        <p>Lorem ipsum dolor sit amet, 
                            consectetur adipiscing elit. Praesent porta, diam quis semper tincidunt, 
                            ante ante pellentesque lectus, vitae mollis tellus massa non risus. Nullam non eros auctor, 
                            viverra erat eget, condimentum nibh.
                        </p>
                        <a class="btn-get-started" href="/">Start exploring</a>
                    </div>
                    <div class="col-lg-2 my-5 text-center">
                    </div>
                    <div class="col-lg-3 my-5 text-center">
                        <img src={img1} class="img-fluid animated" alt="home1_icon"/>
                    </div>

            </div>
            {/*//////////////////////////////////////////////////////////////////////////// */}
            <div class="row my-5 mx-auto" style={{ backgroundImage: `url(${ab1})` ,
                                                            backgroundSize: 'cover',
                                                            width:'100%', height: '500px'}}>
                <div class="col-lg-12 py-5 text-align-center" style={{background: 'rgba(0, 0, 0, 0.1)',
                                                                    display: 'flex',
                                                                    justifyContent: 'center',
                                                                    alignItems: 'center',
                                                                    textShadowColor:'#585858',}}>
                    <h1 class="my-auto text-align-center" style={{}}>
                        <u>About Us</u>
                        <p style={{fontSize:'25px'}}>Lorem ipsum dolor sit amet,
                            consectetur adipiscing elit. Praesent porta, diam quis semper tincidunt, 
                            ante ante pellentesque lectus, vitae mollis tellus massa non risus. Nullam non eros auctor, 
                            viverra erat eget, condimentum nibh. 
                            consectetur adipiscing elit. Praesent porta, diam quis semper tincidunt,
                        </p>
                    </h1>
                    
                </div>
            </div>
            <p><br></br></p>
        </div>
      );
  }
}

export default Home;
