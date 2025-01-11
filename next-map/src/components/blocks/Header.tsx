import React from 'react'
import styled from 'styled-components'
import Image from 'next/image'
import Link from 'next/link'
import { media } from '../helpers/media'

const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: #f0f0f0;
`

const Logo = styled.div`
  position: relative;
  width: 80px;
  height: 80px;
`

const Nav = styled.nav`
  ul {
    list-style-type: none;
    padding: 0;
    display: flex;
    flex-direction: column;

    ${media.md`
      flex-direction: row;
    `}
  }

  li {
    margin-bottom: 0.5rem;

    ${media.md`
      margin-bottom: 0;
      margin-right: 1rem;
    `}
  }

  a {
    color: #333;
    text-decoration: none;
    font-weight: bold;
  }
`

const Header = () => {
  return (
    <HeaderContainer>
      <Logo>
        <Link href="/">
          <Image
            src="/img/logo.png"
            alt="OPEN3D Map Logo"
            layout="fill"
            objectFit="contain"
            priority
          />
        </Link>
      </Logo>
      <Nav>
        <ul>
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/map">Map</Link>
          </li>
        </ul>
      </Nav>
    </HeaderContainer>
  )
}

export default Header
