export enum FilterSubject {
	STREETLIGHTS = 'streetlights in the same block',
	CRASHES = 'crashes in the same block',
	SAFESTAY_SCORE = 'as its SafeStay score',
	COMMUNITY_SCORE = 'as its community score',
}

export enum BoundType {
	AT_LEAST = 'at least',
	AT_MOST = 'at most',
}

export interface FilterInfo {
	subject: FilterSubject | undefined;
	threshold: number | undefined;
	bound_type: BoundType | undefined;
}
