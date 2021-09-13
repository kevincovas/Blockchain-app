import React, { useEffect, useState } from "react";
import { HOST } from "../../../config/const";

function Home() {
    return (
      <div className="home">
        <div className="container">
            </div>
              <h1 className="font-weight-light">PELUQUERÍA ARKUS</h1>
              <p>
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy text
                ever since the 1500s, when an unknown printer took a galley of
                type and scrambled it to make a type specimen book.
              </p>
          <img
                className="img-fluid rounded mb-4 mb-lg-0"
                src="http://placehold.it/900x400"
                alt=""
          />
      </div>
    );
  }
  
  export default Home;

