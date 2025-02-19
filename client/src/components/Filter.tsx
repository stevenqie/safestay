import { FC } from 'react';
import {
	HStack,
	IconButton,
	NumberDecrementStepper,
	NumberIncrementStepper,
	NumberInput,
	NumberInputField,
	NumberInputStepper,
	Select,
} from '@chakra-ui/react';
import { BoundType, FilterInfo, FilterSubject } from '../types/Filter';
import { DeleteIcon } from '@chakra-ui/icons';

interface FilterProps {
	index: number;
	filter: FilterInfo;
	updateFilters: (newValue: FilterInfo) => void;
	removeFilter: () => void;
}

const Filter: FC<FilterProps> = ({
	index,
	filter,
	updateFilters,
	removeFilter,
}) => {
	return (
		<HStack gap="6">
			<Select
				isRequired={true}
				placeholder="Please select"
				value={filter.bound_type}
				onChange={(e) => {
					updateFilters({
						...filter,
						bound_type:
							e.target.value === '' ? undefined : (e.target.value as BoundType),
					});
				}}
			>
				{Object.keys(BoundType).map((key) => (
					<option key={key} value={key}>
						{BoundType[key as keyof typeof BoundType]}
					</option>
				))}
			</Select>
			<NumberInput
				value={filter.threshold}
				onChange={(e) => {
					updateFilters({
						...filter,
						threshold: parseInt(e),
					});
				}}
				min={0}
				max={100}
				step={1}
			>
				<NumberInputField />
				<NumberInputStepper>
					<NumberIncrementStepper />
					<NumberDecrementStepper />
				</NumberInputStepper>
			</NumberInput>
			<Select
				isRequired={true}
				placeholder="Please select"
				value={filter.subject}
				onChange={(e) => {
					updateFilters({
						...filter,
						subject:
							e.target.value === ''
								? undefined
								: (e.target.value as FilterSubject),
					});
				}}
			>
				{Object.keys(FilterSubject).map((key) => (
					<option key={key} value={key}>
						{FilterSubject[key as keyof typeof FilterSubject]}
					</option>
				))}
			</Select>
			<IconButton
				aria-label="Delete"
				isDisabled={index === 0}
				onClick={removeFilter}
				icon={<DeleteIcon />}
			/>
		</HStack>
	);
};

export default Filter;
