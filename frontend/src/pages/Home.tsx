import React from 'react'
import Header from '@src/layouts/Header'
import { ProjectDescription } from '@src/components/ProjectDescription'
import { HomeGuide } from '@src/components/HomeGuide'

const Home = () => {
  return (
    <>
      <Header />
      <ProjectDescription />
      <HomeGuide />
    </>
  )
}
export default Home
