import React, { useContext, useState, useEffect } from "react";
import EthereumContext from "./ethereumContext";
import { getStakedAmount } from "./ethereum/ethFunc";

//import { stake, getStakedAmount } from "./ethereum/ethFunc";

export default function ChildComponent() {
  const [values, setValues] = useState({ stakedAmount: -1 });

  const ethereumContext = useContext(EthereumContext);

  useEffect(() => {
    console.log("----== child1()");
    //cannot add async here, so make async below
    const readValue = async () => {
      console.log("running readValue");
      //event.preventDefault();
      setValues({ loading: true, errorMessage: "" });
      try {
        const stakedAmount = await getStakedAmount(ethereumContext).catch((err) => {
          console.log(`${err}`);
          return;
        });
        console.log("stakedAmount:", stakedAmount);
        setValues({ stakedAmount: stakedAmount });
        //Router.replaceRoute(`/campaigns/${this.props.address}`);
      } catch (err) {
        setValues({ errorMessage: err.message });
      }
      setValues({ loading: false, value: "" });
    };
    readValue();
  }, [ethereumContext]); //[] for running once

  return (
    <div>
      <p>values: {values["stakedAmount"]}</p>
    </div>
  );
}
