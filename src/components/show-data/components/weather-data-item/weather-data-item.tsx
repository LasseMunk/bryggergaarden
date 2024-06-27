import { Measurement } from "../../../../hooks";

export const WeatherDataItem = (props: Measurement) => {
	const { calculatedAt, daysAgo, value } = props;

	return (
		<div className='flex flex-col gap-2 p-2 border-2 border-dashed border-gray-400 '>
			<p className='font-bold'>{calculatedAt}</p>
			<p>{daysAgo} dage siden</p>
			<p>
				<span className='font-bold'>{value}</span> grader celcius
			</p>
		</div>
	);
};
