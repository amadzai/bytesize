import { createBrowserRouter } from 'react-router-dom';
import { Layout } from './layouts/Layout';
import { Home } from './pages/Home';
import { History } from './pages/History';

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Layout>
        <Home />
      </Layout>
    ),
  },
  {
    path: '/history',
    element: (
      <Layout>
        <History />
      </Layout>
    ),
  },
]);
