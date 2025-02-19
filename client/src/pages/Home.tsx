import { useEffect, useState } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import {
	HStack,
	Box,
	Heading,
	VStack,
	Text,
	Button,
	Image,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import Filters from '../components/Filters';
import { Apartment } from '../types/Apartment';
import axios from 'axios';
import { FilterInfo } from '../types/Filter';

import Map, { Marker, NavigationControl, Popup } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MapPinIcon } from '@heroicons/react/16/solid';
import RatingsModal from '../components/RatingsModal';
import '@fontsource/nunito/400.css';

const Home = () => {
	const [apartments, setApartments] = useState<Apartment[]>([]);
	const [filtered, setFiltered] = useState<Apartment[]>([]);
	const [filters, setFilters] = useState<FilterInfo[]>([
		{ subject: undefined, threshold: undefined, bound_type: undefined },
	]);
	const [applyClicked, setApplyClicked] = useState<boolean>(false);
	const [showAllClicked, setShowAllClicked] = useState<boolean>(false);
	const [selectedApartment, setSelectedApartment] = useState<Apartment | null>(
		null,
	);

	const MAPBOX_TOKEN =
		'pk.eyJ1Ijoic3RldmVucWllIiwiYSI6ImNtMzk2MHRlcjB6aXAya3B3ZnMwZmp0eWcifQ.LZpQC7xRtVKDfD56Up-3zQ'; // Replace with your Mapbox token

	const getApartments = async () => {
		try {
			const response = await axios.get('http://localhost:80/api/apartments/');
			setApartments(response.data);
			setFiltered(response.data);
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		getApartments();
	}, []);

	useEffect(() => {
		if (!applyClicked) return;
		const filterApartments = async () => {
			try {
				const response = await axios.post(
					'http://localhost:80/api/apartments/filter',
					{ filters },
				);
				setFiltered(response.data);
			} catch (error) {
				console.error(error);
			}
		};
		setApplyClicked(false);
		filterApartments();
	}, [applyClicked, filters]);

	useEffect(() => {
		if (!showAllClicked) return;
		setFiltered(apartments);
		setShowAllClicked(false);
	}, [apartments, showAllClicked]);

	const navigate = useNavigate();

	const handleSignInClick = () => {
		navigate('/signin');
	};
	const handleSignUpClick = () => {
		navigate('/signup');
	};

	const getPinColor = (score: number): string => {
		if (score >= 0 && score <= 2) return 'red';
		else if (score >= 3 && score <= 6) return 'yellow';
		else if (score >= 7 && score <= 10) return 'green';
		else return 'gray';
	};

	return (
		<VStack minH="100vh" p="0" pb="8" m="0" spacing="0" gap="8">
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
					{localStorage.getItem('username') ? (
						<>
							<Text fontSize="lg" fontWeight="bold" mt="6">
								Welcome, {localStorage.getItem('username')}!
							</Text>
							<Button
								bg="primary.blue"
								_hover={{ bg: 'primary.darkBlue', textDecoration: 'underline' }}
								onClick={() => {
									localStorage.clear();
									window.location.reload();
								}}
							>
								Sign out
							</Button>
						</>
					) : (
						<HStack gap="4">
							<Button
								bg="primary.blue"
								_hover={{ bg: 'primary.darkBlue', textDecoration: 'underline' }}
								onClick={handleSignInClick}
							>
								Sign in
							</Button>
							<Button
								bg="primary.blue"
								_hover={{ bg: 'primary.darkBlue', textDecoration: 'underline' }}
								onClick={handleSignUpClick}
							>
								Sign up
							</Button>
						</HStack>
					)}
				</HStack>
			</Box>
			<Text textAlign="center" maxWidth="800px" mx="auto" fontSize="lg">
				SafeStay was designed to help current and future Champaign residents
				find apartments with ease. Explore the interactive map to view SafeStay
				and Community scores for each property. Use the filters below to refine
				your search and share your experiences by adding your own ratings!
			</Text>
			<Filters
				filters={filters}
				setFilters={setFilters}
				setApplyClicked={setApplyClicked}
				setShowAllClicked={setShowAllClicked}
			/>
			<Text>
				<b>{filtered.length}</b> apartments match your search!
			</Text>

			<Map
				initialViewState={{
					longitude: -88.2434,
					latitude: 40.1164,
					zoom: 12.5,
				}}
				style={{ width: '80vw', height: '80vh' }}
				mapStyle="mapbox://styles/mapbox/streets-v11"
				mapboxAccessToken={MAPBOX_TOKEN}
			>
				<NavigationControl position="top-right" />
				{/* Render Markers */}
				{filtered.map((apartment) => {
					return (
						<Marker
							key={apartment.address}
							longitude={apartment.longitude}
							latitude={apartment.latitude}
						>
							<MapPinIcon
								height="16px"
								width="16px"
								color={getPinColor(apartment.safestay_score)}
								onClick={() => setSelectedApartment(apartment)}
								cursor="pointer"
							/>
						</Marker>
					);
				})}

				{/* Render Popup */}
				{selectedApartment && (
					<Popup
						longitude={selectedApartment.longitude}
						latitude={selectedApartment.latitude}
						anchor="top"
						closeOnClick={false}
						onClose={() => setSelectedApartment(null)}
					>
						<RatingsModal address={selectedApartment.address} />
					</Popup>
				)}
			</Map>
			<VStack maxWidth="80%" gap="0">
				<Text textAlign="center" mx="auto" fontSize="lg">
					SafeStay scores are calculated based on various factors including
					proximity to streetlights, pedestrian crashes, and police stations.
				</Text>
				<Text textAlign="center" mx="auto" fontSize="lg">
					All data is sourced from the Champaign County Regional Data Portal.
				</Text>
			</VStack>
		</VStack>
	);
};

export default Home;
