import {
	Button,
	HStack,
	Text,
	VStack,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalCloseButton,
	ModalBody,
	ModalFooter,
	Input,
	Box,
} from '@chakra-ui/react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface RatingsModalProps {
	address: string;
}

const RatingsModal = ({ address }: RatingsModalProps) => {
	const [safeStayScore, setSafeStayScore] = useState<number | null>(null);
	const [communityScore, setCommunityScore] = useState<number | null>(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [hasRated, setHasRated] = useState(false);
	const [currentRating, setCurrentRating] = useState<number | null>(null);
	const [newRating, setNewRating] = useState<number | null>(null);
	const navigate = useNavigate();

	const fetchScores = async (address: string) => {
		try {
			const response = await axios.get(
				'http://localhost:80/api/apartments/fetchScores',
				{
					params: { address },
				},
			);
			setSafeStayScore(response.data.data.safestay_score);
			setCommunityScore(response.data.data.community_score);
		} catch (error) {
			console.error('Error fetching scores:', error);
		}
	};
	useEffect(() => {
		if (address) {
			fetchScores(address);
		}
	}, [address]);

	const checkIfRated = async () => {
		try {
			const response = await axios.get(
				'http://localhost:80/api/ratings/checkUserRating',
				{
					params: { address, username: localStorage.getItem('username') },
				},
			);
			if (response.data.hasRated) {
				setHasRated(true);
				setCurrentRating(response.data.rating);
			} else {
				setHasRated(false);
			}
		} catch (error) {
			console.error('Error checking rating:', error);
		}
	};

	const handleOpenModal = () => {
		checkIfRated();
		setIsModalOpen(true);
	};

	const handleSubmitRating = async () => {
		try {
			const endpoint = hasRated
				? 'http://localhost:80/api/ratings/updateRating'
				: 'http://localhost:80/api/ratings/addRating';
			await axios.post(endpoint, {
				address,
				username: localStorage.getItem('username'),
				rating: newRating,
			});
			setIsModalOpen(false);
			setNewRating(null);
			fetchScores(address);
		} catch (error) {
			console.error('Error submitting rating:', error);
		}
	};

	return (
		<>
			<Box p="2">
				<Text fontSize="sm" fontWeight="bold" textAlign="left">
					{address}
				</Text>
				<Box>
					<HStack justifyContent="space-around" alignItems="center">
						<VStack>
							<Text fontSize="xs" mb="1">
								SafeStay Score
							</Text>
							<Text fontSize="medium" fontWeight="bold">
								{safeStayScore}
							</Text>
						</VStack>
						<VStack>
							<Text fontSize="xs" mb="1">
								Community Score
							</Text>
							<Text fontSize="medium" fontWeight="bold">
								{communityScore != undefined
									? communityScore != -1
										? communityScore.toFixed(2)
										: 'N/A'
									: 'N/A'}
							</Text>
						</VStack>
					</HStack>
					<Box display="flex" justifyContent="flex-end" mt="4">
						{localStorage.getItem('signedIn') ? (
							<Button
								mt="4"
								size="xs"
								colorScheme="blue"
								onClick={handleOpenModal}
							>
								Rate address
							</Button>
						) : (
							<Button
								mt="4"
								size="xs"
								colorScheme="blue"
								onClick={() => navigate('/signin')}
							>
								Sign in to rate
							</Button>
						)}
					</Box>
				</Box>
			</Box>
			<Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>
						{hasRated ? 'Update Your Rating' : 'Add a Rating'}
					</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						{hasRated ? (
							<>
								<Text>Your current rating: {currentRating}</Text>
								<Text>Update your rating:</Text>
							</>
						) : (
							<Text>Add your rating for this address:</Text>
						)}
						<Input
							type="number"
							placeholder="Enter a rating (0-10)"
							value={newRating !== null ? newRating : ''}
							onChange={(e) => {
								const value = e.target.value;
								const numericValue = value === '' ? null : Number(value);
								if (
									numericValue === null ||
									(numericValue >= 0 && numericValue <= 10)
								) {
									setNewRating(numericValue);
								}
							}}
							mt="4"
						/>
					</ModalBody>
					<ModalFooter>
						<Button colorScheme="blue" mr="3" onClick={handleSubmitRating}>
							Submit
						</Button>
						<Button variant="ghost" onClick={() => setIsModalOpen(false)}>
							Cancel
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
};

export default RatingsModal;
