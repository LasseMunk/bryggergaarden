import { useEffect, useState } from "react";
import { useFetchData } from "../../hooks/use-fetch-data/use-fetch-data";
import { WeatherDataItem } from "./components";
import { Measurement } from "../../hooks";
import moment from "moment";

export const ShowWeatherData = () => {
	const [measurements, setMeasurements] = useState<Measurement[]>([]);
	const startDate = moment().subtract(16, "days").format("YYYY-MM-DD");
	const endDate = moment().format("YYYY-MM-DD");

	const { fetchData } = useFetchData({ startDate, endDate, setMeasurements });

	const temperatureArray = measurements.map((measurement) => measurement.value);

	useEffect(() => {
		const abortController = new AbortController(); // Create an instance of AbortController
		const signal = abortController.signal; // Get the AbortSignal from the controller

		fetchData({ signal }).catch((error) => {
			if (error.name !== "AbortError") {
				console.error("Fetch error:", error);
			}
		});

		return () => {
			abortController.abort(); // Abort the fetch operation on cleanup
		};
	}, []);

	return (
		<div className='flex flex-col gap-4'>
			<div className='flex flex-row gap-2 flex-wrap'>{measurements.map((measurement, index) => index > 0 && <WeatherDataItem key={index} {...measurement} />)}</div>
			<p className='font-bold text-2xl'>
				{temperatureArray.filter((temp) => temp > 25).length >= 14
					? "Ja"
					: `Nej... men gennemsnittet var ${temperatureArray.reduce((a, b) => a + b, 0) / temperatureArray.length - 1} grader celcius så er vi ikke tæt nok på til en lille bitte øl :D ?`}
			</p>
		</div>
	);
};
