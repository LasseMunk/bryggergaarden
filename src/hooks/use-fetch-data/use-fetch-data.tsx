import moment from "moment";
import { FetchDataProps, FetchDataRequest, MeasurementObjectFromApi } from "./fetch-data-types";
import { PART_FIVE, PART_FOUR, PART_ONE, PART_THREE, PART_TWO } from "../../static/static";

export const useFetchData = (props: FetchDataProps) => {
	const { startDate, endDate, setMeasurements } = props;

	const url = `https://dmigw.govcloud.dk/v2/climateData/collections/10kmGridValue/items?cellId=10km_610_57&datetime=${startDate}T23%3A59%3A59Z%2F${endDate}T23%3A59%3A59Z&parameterId=max_temp_w_date&timeResolution=day&bbox-crs=https%3A%2F%2Fwww.opengis.net%2Fdef%2Fcrs%2FOGC%2F1.3%2FCRS84&api-key=${PART_ONE}-${PART_TWO}-${PART_THREE}-${PART_FOUR}-${PART_FIVE}
    `;

	const convertToDateAndTime = (date: string) => {
		return moment(date).format("LL");
	};

	const convertDaysAgo = (date: string) => {
		const dateMoment = moment(date);
		const now = moment().startOf("day");
		const daysAgo = now.diff(dateMoment, "days");
		return daysAgo;
	};

	const fetchData = async ({ signal }: FetchDataRequest) => {
		try {
			const response = await fetch(url, { signal });
			const data = await response.json();

			setMeasurements(
				data.features.map((measurement: MeasurementObjectFromApi) => ({
					from: convertToDateAndTime(measurement.properties.from),
					to: convertToDateAndTime(measurement.properties.to),
					calculatedAt: convertToDateAndTime(measurement.properties.calculatedAt),
					value: measurement.properties.value,
					daysAgo: convertDaysAgo(measurement.properties.from),
				}))
			);
		} catch (error) {
			console.log(error);
		}
	};

	return { fetchData };
};
