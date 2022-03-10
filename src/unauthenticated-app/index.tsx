import React from "react";
import {RegisterScreen} from "./register";
import {LoginScreen} from "./login";
import {Card, Divider} from "antd";
import styled from "@emotion/styled";
import logo from 'assets/logo.svg'
import left from 'assets/left.svg'
import right from 'assets/right.svg'


export const UnauthenticatedApp = () => {
    const [isRegister, setIsRegister] = React.useState(false);

    return (
        <Container>
            <Header/>
            <Background/>
            <ShadowCard>
                <Title>
                    {isRegister ? '请注册' : '请登录'}
                </Title>
                {isRegister ? <RegisterScreen/> : <LoginScreen/>}
                <Divider/>
                <a onClick={() => setIsRegister(!isRegister)}>
                    {isRegister ? "已有账号？直接登录" : "没有账号？注册新账号"}
                </a>
            </ShadowCard>
        </Container>
    );
};

const Title = styled.h2`
  margin-bottom: 2.4rem;
  color: rgb(94,108,132)
`

const Background = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-position: left bottom, right bottom;
  background-size: calc(((100vw - 40rem) / 2) - 3.2rem),
    calc(((100vw - 40rem) / 2) - 3.2rem), cover;
  background-image: url(${left}), url(${right});
`;

const Header = styled.header`
  background: url(${logo}) no-repeat center;
  padding: 5rem 0;
  background-size: 8rem;
  width:100%;
`

const ShadowCard = styled(Card)`
  width: 40rem;
  min-height: 56rem;
  padding: 3.2rem 4rem;
  border-radius: 0.3rem;
  box-sizing: border-box;
  box-shadow: rgba(0,0,0,0.1) 0 0 10px;
  text-align: center;
`


const Container = styled.div`
  display: flex;
  flex-flow: column;
  align-items: center;
  min-height: 100vh;
`