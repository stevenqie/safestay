import {
	Button,
	Box,
	HStack,
	FormControl,
	FormErrorMessage,
	FormLabel,
	Heading,
	Input,
	Text,
	Image,
	VStack,
} from '@chakra-ui/react';
import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Signin = () => {
	const navigate = useNavigate();

	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [passwordError, setPasswordError] = useState('');

	const handleUsername = (e: React.ChangeEvent<HTMLInputElement>) =>
		setUsername(e.target.value);
	const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) =>
		setPassword(e.target.value);

	const validateAccount = async (username: string, password: string) => {
		try {
			const response = await axios.get(
				'http://localhost:80/api/users/validateAccount',
				{
					params: { username, password },
				},
			);
			return response.data;
		} catch (error) {
			console.error(error);
		}
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const res = await validateAccount(username, password);
		if (res.success) {
			localStorage.setItem('signedIn', 'true');
			localStorage.setItem('username', username);
			navigate('/');
		} else {
			setPasswordError('Username or password is incorrect.');
		}
	};

	return (
		<VStack minH="100vh" gap="8" minW="100vw" p="0" m="0" spacing="0">
			<Box w="100%" p="5" bg="white">
				<HStack w="100%" justify="space-between" p="2">
					<HStack justify="space-between" spacing={2}>
						<Image
							src="src/assets/logo.png"
							alt="SafeStay Logo"
							boxSize="38px"
							objectFit="contain"
						/>
						<Heading>SafeStay</Heading>
					</HStack>
					<HStack gap="4">
						<Button
							bg="primary.blue"
							_hover={{ bg: 'primary.darkBlue', textDecoration: 'underline' }}
							onClick={() => navigate('/')}
						>
							Back to Home
						</Button>
					</HStack>
				</HStack>
			</Box>
			<VStack
				w="100vw"
				h="70vh"
				justifyContent="center"
				alignItems="center"
				gap="10"
			>
				<Heading>Sign in to Add Ratings!</Heading>
				<form onSubmit={handleSubmit}>
					<VStack
						width="500px"
						gap="3"
						p="8"
						border="1px solid"
						borderColor="gray.300"
						borderRadius="lg"
						boxShadow="xs"
						bg="white"
					>
						<FormControl isInvalid={passwordError.length > 0}>
							<FormLabel>Username</FormLabel>
							<Input id="username" value={username} onChange={handleUsername} />
						</FormControl>
						<FormControl isInvalid={passwordError.length > 0}>
							<FormLabel>Password</FormLabel>
							<Input
								id="password"
								type="password"
								value={password}
								onChange={handlePassword}
							/>
							{passwordError.length > 0 && (
								<FormErrorMessage>{passwordError}</FormErrorMessage>
							)}
						</FormControl>
						<Button
							type="submit"
							bg="#E3F5FC"
							_hover={{ bg: '#9FDEFB', textDecoration: 'underline' }}
							mt="6"
							w="100%"
							border="1px solid"
							borderColor="gray.300"
						>
							Sign in
						</Button>
					</VStack>
				</form>
				<Text>
					Don't have an account?{' '}
					<Button
						color="#4682B4"
						variant="link"
						colorScheme="teal"
						onClick={() => navigate('/signup')}
					>
						Sign up
					</Button>
				</Text>
			</VStack>
		</VStack>
	);
};

export default Signin;
