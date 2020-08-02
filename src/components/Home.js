import React from "react";
import { Link } from "react-router-dom"

/**
 * Component to display the home screen.
 */
const Home = () => {
    return (<div>
        <section id='hero' style={{ alignItems: "center", alignContent: "center", display: "flex" }}>

            <div style={{ textAlign: "center", position: "relative", alignContent: "center", alignItems: "center", verticalAlign: "middle", marginLeft: "600px" }} >
                <button class="fluid ui black button" style={{ borderRadius: "10px" }}>

                    <Link to='/Blog/CreatePost' className="link"> Create Your Blog !!</Link>

                </button>
                <h2 style={{ backgroundColor: "white", opacity: "0.6" }}>Start Your Blogging today !</h2>
            </div>

        </section>


    </div>)
}

export default Home;