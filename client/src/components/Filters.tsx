import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react';
import Filter from './Filter';
import { Box, Button, Heading, HStack, Text, VStack } from '@chakra-ui/react';
import { FilterInfo } from '../types/Filter';
import { CheckIcon } from '@chakra-ui/icons';

interface FiltersProps {
	filters: FilterInfo[];
	setFilters: Dispatch<SetStateAction<FilterInfo[]>>;
	setApplyClicked: Dispatch<SetStateAction<boolean>>;
	setShowAllClicked: Dispatch<SetStateAction<boolean>>;
}

const Filters: FC<FiltersProps> = ({
	filters,
	setFilters,
	setApplyClicked,
	setShowAllClicked,
}) => {
	const [applied, setApplied] = useState<boolean>(false);

	useEffect(() => {
		setApplied(false);
	}, [filters, setApplied]);

	const updateFilters = (index: number, newValue: FilterInfo) => {
		const newItems = [...filters];
		newItems[index] = newValue;
		setFilters(newItems);
	};

	const removeFilter = (index: number) => {
		setFilters([...filters.slice(0, index), ...filters.slice(index + 1)]);
	};

	const incompleteFilter = () => {
		return (
			filters.slice(-1)[0]?.subject === undefined ||
			filters.slice(-1)[0]?.threshold === undefined ||
			filters.slice(-1)[0]?.bound_type === undefined
		);
	};

	return (
		<VStack>
			<VStack
				gap="6"
				boxShadow="0 -2px 4px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.1)"
				borderRadius="md"
				py="4"
				px="6"
			>
				<Box width="100%" display="flex" justifyContent="flex-start">
					<Heading size="md">Show apartments with...</Heading>
				</Box>
				<VStack>
					{filters.map((filter, index) => (
						<Filter
							key={index}
							index={index}
							filter={filter}
							updateFilters={(newValue: FilterInfo) =>
								updateFilters(index, newValue)
							}
							removeFilter={() => removeFilter(index)}
						/>
					))}
					<Button
						w="100%"
						variant="outline"
						mt="2"
						isDisabled={incompleteFilter()}
						onClick={() => {
							setFilters([
								...filters,
								{
									subject: undefined,
									threshold: undefined,
									bound_type: undefined,
								},
							]);
						}}
					>
						Add another filter
					</Button>
				</VStack>

				<Button
					isDisabled={applied || incompleteFilter()}
					onClick={() => {
						setApplied(true);
						setApplyClicked(true);
					}}
				>
					{applied ? (
						<HStack>
							<Text>Applied</Text>
							<CheckIcon />
						</HStack>
					) : (
						'Apply filters'
					)}
				</Button>
			</VStack>
			<Button
				colorScheme="blue"
				w="100%"
				onClick={() => {
					setApplied(false);
					setShowAllClicked(true);
				}}
			>
				Show all apartments
			</Button>
		</VStack>
	);
};

export default Filters;
