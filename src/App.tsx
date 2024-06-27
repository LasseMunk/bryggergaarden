import { ShowWeatherData } from "./components/show-data/show-data";

function App() {
	return (
		<div className='flex flex-col gap-4 p-4'>
			<h1 className='text-3xl font-bold underline'>Er der 14 dage med over 25 grader celcius på bryggergården?</h1>
			<ShowWeatherData />
		</div>
	);
}

export default App;
