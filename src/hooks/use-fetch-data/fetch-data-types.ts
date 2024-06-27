import { Dispatch, SetStateAction } from "react";

export type Measurement = {
	from: string;
	to: string;
	calculatedAt: string;
	value: number;
	daysAgo: number;
};

type Geometry = {
	coordinates: number[][][];
	type: "Polygon";
};

type Properties = {
	calculatedAt: string;
	cellId: string;
	created: string;
	from: string;
	parameterId: string;
	qcStatus: string;
	timeResolution: string;
	to: string;
	value: number;
};

export type MeasurementObjectFromApi = {
	geometry: Geometry;
	id: string;
	type: "Feature";
	properties: Properties;
};

export type FetchDataProps = {
	startDate: string;
	endDate: string;
	setMeasurements: Dispatch<SetStateAction<Measurement[]>>;
};

export type FetchDataRequest = {
	signal: AbortSignal;
};
