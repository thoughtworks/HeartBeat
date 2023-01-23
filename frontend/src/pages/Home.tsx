import React from 'react';
import HomeGuide from '@src/components/HomeGuide';
import ProjectDescription from '@src/components/ProjectDescription';
import Header from '@src/layouts/Header';

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
