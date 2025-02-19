import {
	Button,
	FormControl,
	FormErrorMessage,
	Box,
	HStack,
	Text,
	FormLabel,
	Heading,
	Input,
	VStack,
	Link,
	Image,
} from '@chakra-ui/react';
import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import '@fontsource/nunito/700.css';

const Signup = () => {
	const navigate = useNavigate();

	const [firstName, setFirstName] = useState('');
	const [lastName, setLastname] = useState('');
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [firstNameError, setFirstNameError] = useState('');
	const [lastNameError, setLastNameError] = useState('');
	const [usernameError, setUserNameError] = useState('');
	const [passwordError, setPasswordError] = useState('');

	const handleFirstName = (e: React.ChangeEvent<HTMLInputElement>) =>
		setFirstName(e.target.value);
	const handleLastName = (e: React.ChangeEvent<HTMLInputElement>) =>
		setLastname(e.target.value);
	const handleUsername = (e: React.ChangeEvent<HTMLInputElement>) =>
		setUsername(e.target.value);
	const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) =>
		setPassword(e.target.value);

	const checkUsername = async (username: string) => {
		try {
			const response = await axios.get(
				'http://localhost:80/api/users/checkUsername',
				{
					params: { username },
				},
			);
			return response.data;
		} catch (error) {
			console.error(error);
		}
	};

	const createAccount = async (
		firstName: string,
		lastName: string,
		username: string,
		password: string,
	) => {
		try {
			const response = await axios.post(
				'http://localhost:80/api/users/createAccount',
				{
					firstName,
					lastName,
					username,
					password,
				},
			);
			return response.data;
		} catch (error) {
			console.error(error);
			throw new Error('Failed to create account');
		}
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (firstName.length === 0)
			setFirstNameError('Name field cannot be empty.');
		else setFirstNameError('');

		if (lastName.length === 0) setLastNameError('Name field cannot be empty.');
		else setLastNameError('');

		if (username.length < 5)
			setUserNameError('Must contain at least 5 characters.');
		else setUserNameError('');

		if (password.length < 8)
			setPasswordError('Must contain at least 8 characters.');
		else setPasswordError('');

		if (
			firstNameError.length === 0 &&
			lastNameError.length === 0 &&
			usernameError.length === 0 &&
			passwordError.length === 0
		) {
			const res = await checkUsername(username);
			if (res.userFound) {
				setUserNameError('Username already in use.');
			} else {
				const signUpResponse = await createAccount(
					firstName,
					lastName,
					username,
					password,
				);
				if (signUpResponse.success) {
					localStorage.setItem('signedIn', 'true');
					localStorage.setItem('username', username);
					navigate('/');
				} else {
					console.log('Error registering user:');
				}
			}
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
				h="75vh"
				justifyContent="center"
				alignItems="center"
				gap="10"
			>
				<Heading>Create a SafeStay Account!</Heading>
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
						<FormControl isInvalid={firstNameError.length > 0}>
							<FormLabel>First Name</FormLabel>
							<Input
								id="firstName"
								value={firstName}
								onChange={handleFirstName}
							/>
							{firstNameError.length > 0 && (
								<FormErrorMessage>{firstNameError}</FormErrorMessage>
							)}
						</FormControl>
						<FormControl isInvalid={lastNameError.length > 0}>
							<FormLabel>Last Name</FormLabel>
							<Input id="lastName" value={lastName} onChange={handleLastName} />
							{lastNameError.length > 0 && (
								<FormErrorMessage>{lastNameError}</FormErrorMessage>
							)}
						</FormControl>
						<FormControl isInvalid={usernameError.length > 0}>
							<FormLabel>Username</FormLabel>
							<Input id="username" value={username} onChange={handleUsername} />
							{usernameError.length > 0 && (
								<FormErrorMessage>{usernameError}</FormErrorMessage>
							)}
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
							Sign up
						</Button>
					</VStack>
				</form>
				<Text>
					Already have an account?{' '}
					<Link href="/signin" color="#4682B4" fontWeight="bold">
						Sign in
					</Link>
				</Text>
			</VStack>
		</VStack>
	);
};

export default Signup;
