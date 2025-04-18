import React from 'react'
import styled from 'styled-components'
import { Global, css } from '@emotion/react'
import Header from '../blocks/Header'

const Layout = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`

const Main = styled.main`
  flex: 1;
  padding: 2rem;
`

const Footer = styled.footer`
  background-color: #333;
  color: white;
  padding: 1rem;
  text-align: center;
`

interface LayoutWithFooterProps {
  children: React.ReactNode
}

export const LayoutWithFooter: React.FC<LayoutWithFooterProps> = ({ children }) => (
  <Layout>
    <Global
      styles={css`
        html,
        body,
        #__next {
          width: 100%;
          height: 100%;
          margin: 0;
          color: #333;
        }
      `}
    />
    <Header />
    <Main>{children}</Main>
    <Footer>©︎ OPEN3D Map</Footer>
  </Layout>
)
