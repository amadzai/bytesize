import { createBrowserRouter } from 'react-router-dom';
import { Layout } from './layouts/Layout';
import { Home } from './pages/Home';
import { Analytics } from './pages/Analytics';

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
        <Analytics />
      </Layout>
    ),
  },
]);
