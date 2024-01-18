import { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import routes from '@src/config/routes';
import { Loading } from './components/Loading';
import Home from './pages/Home';

const Router = () => {
  const appRoutes = routes.map((item) => {
    return <Route key={item.path} path={item.path} element={<item.component />} />;
  });
  return (
    <ErrorBoundary
      fallbackRender={Home}
      onError={() => {
        window.location.href = '/';
      }}
    >
      <Suspense fallback={<Loading />}>
        <Routes>{appRoutes}</Routes>
      </Suspense>
    </ErrorBoundary>
  );
};

export default Router;
