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
      <Link href="/">
        <Logo>
          <Image
            src="/img/logo.png"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            alt="OPEN3D Map Logo"
            fill
            style={{ objectFit: 'contain' }}
            priority
          />
        </Logo>
      </Link>
      <Nav>
        <ul>
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/">About</Link>
          </li>
        </ul>
      </Nav>
    </HeaderContainer>
  )
}

export default Header
