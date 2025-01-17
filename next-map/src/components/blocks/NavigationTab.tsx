import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import styled from 'styled-components'

const TabContainer = styled.div`
  display: flex;
  justify-content: center;
  padding: 10px 0;
  border-bottom: 1px solid #e0e0e0;
  margin-bottom: 20px;
`

const TabLink = styled(Link)``

const TabButton = styled.button<{ active: boolean }>`
  padding: 10px 20px;
  margin: 0 10px 0;
  font-size: 1.2rem;
  background-color: ${(props) => (props.active ? '#007bff' : 'transparent')};
  color: ${(props) => (props.active ? 'white' : 'black')};
  border-radius: 5px;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${(props) => (props.active ? '#007bff' : '#e0e0e0')};
  }
`

const NavigationTab: React.FC = () => {
  const router = useRouter()

  return (
    <TabContainer>
      <TabLink href="/list" passHref>
        <TabButton active={router.pathname === '/'}>一覧をみる</TabButton>
      </TabLink>
      <TabLink href="/map" passHref>
        <TabButton active={router.pathname === '/map'}>地図を見る</TabButton>
      </TabLink>
    </TabContainer>
  )
}

export default NavigationTab
