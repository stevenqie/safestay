import Home from './pages/Home';
import Signin from './pages/Signin';
import Signup from './pages/Signup';

const routes = [
	{
		path: '/',
		element: <Home />,
	},
	{
		path: '/signup',
		element: <Signup />,
	},
	{
		path: '/signin',
		element: <Signin />,
	},
];
export default routes;
