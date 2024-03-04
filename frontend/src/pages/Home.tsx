import { ProjectDescription } from '@src/components/ProjectDescription';
import { HomeGuide } from '@src/components/HomeGuide';
import Header from '@src/layouts/Header';
import React from 'react';

const Home = () => {
  return (
    <>
      <Header />
      <ProjectDescription />
      <HomeGuide />
    </>
  );
};
export default Home;
