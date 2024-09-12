import styled from "styled-components";
import {  BannerHome } from "../../index";
import { useEffect, useState } from "react";
import { exploreDatabase } from "../../../generator";

export function HomeTemplate() {

  useEffect(() => {
    exploreDatabase().then(() => console.log("EXPLORE DB"));  
  }, []);
  
  
  
  return (
    <Main>
      <BannerHome/>
    </Main>
  );


}
const Main = styled.main`
  min-height: 100vh;
  width: 100%;
  background-color: ${(props) => props.theme.bgtotal};
  color: ${({ theme }) => theme.text};
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
  font-size:26px;
  
`;

