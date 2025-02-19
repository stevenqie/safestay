import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import routes from './routes';
import { ChakraProvider } from '@chakra-ui/react';
import theme from './styles/theme';

function App() {
	const router = createBrowserRouter(routes);
	return (
		<ChakraProvider theme={theme}>
			<RouterProvider router={router} />
		</ChakraProvider>
	);
}
export default App;
