import { useRef, useState, useEffect, useCallback } from "react";

export const ChristmasTreeWheel = () => {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const defaultNames = ["Anstina", "Henrik", "Janne", "Jeppe", "Katrine", "Lasse", "Mads", "Marlene", "Mette", "Rasmus", "Stine"];
	const [names, setNames] = useState<string[]>(defaultNames);
	const [inputNames, setInputNames] = useState<string>(defaultNames.join(", "));
	const [rotationTime, setRotationTime] = useState<number>(20);
	const [isRotating, setIsRotating] = useState<boolean>(false);
	const [speed] = useState<number>(3); // Add speed state
	const [angle, setAngle] = useState<number>(0);
	const [santaPosition, setSantaPosition] = useState<{ x: number; y: number } | null>(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		const ctx = canvas?.getContext("2d");
		if (ctx) {
			drawTree(ctx);
			drawNames(ctx);
			if (santaPosition) {
				drawSanta(ctx, santaPosition.x, santaPosition.y);
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [names, angle, santaPosition]);

	const drawTree = useCallback(
		(ctx: CanvasRenderingContext2D) => {
			ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
			ctx.save();
			ctx.translate(ctx.canvas.width / 2, ctx.canvas.height / 2);
			ctx.rotate(angle);

			// Draw the tree
			ctx.fillStyle = "green";
			ctx.beginPath();
			ctx.moveTo(0, -100);
			ctx.lineTo(50, 50);
			ctx.lineTo(-50, 50);
			ctx.closePath();
			ctx.fill();

			// Draw the star
			ctx.fillStyle = "yellow";
			ctx.beginPath();
			ctx.moveTo(0, -120);
			for (let i = 0; i < 5; i++) {
				ctx.lineTo(Math.cos(((18 + i * 72) / 180) * Math.PI) * 20, -120 + Math.sin(((18 + i * 72) / 180) * Math.PI) * 20);
				ctx.lineTo(Math.cos(((54 + i * 72) / 180) * Math.PI) * 10, -120 + Math.sin(((54 + i * 72) / 180) * Math.PI) * 10);
			}
			ctx.closePath();
			ctx.fill();

			// Draw the letters "BRYGGERGÅRDEN" like candy
			const letters = "BRYGGERGÅRDEN";
			ctx.fillStyle = "red";
			ctx.font = "20px Arial";
			const letterSpacing = 15;
			for (let i = 0; i < letters.length; i++) {
				ctx.fillText(letters[i], -90 + i * letterSpacing, 0);
			}

			ctx.restore();
		},
		[angle]
	);

	const drawNames = (ctx: CanvasRenderingContext2D) => {
		const radius = 150;
		const centerX = ctx.canvas.width / 2;
		const centerY = ctx.canvas.height / 2;
		names.forEach((name, index) => {
			const angle = (index / names.length) * 2 * Math.PI;
			const x = centerX + radius * Math.cos(angle);
			const y = centerY + radius * Math.sin(angle);
			ctx.fillText(name, x, y);
		});
	};

	const handleStart = () => {
		setIsRotating(true);
		const start = Date.now();
		const duration = (rotationTime * 1000) / speed;

		// Calculate the target angle
		const randomIndex = Math.floor(Math.random() * names.length);
		const targetAngle = (randomIndex / names.length) * 2 * Math.PI + Math.PI * 4;

		const animate = () => {
			const now = Date.now();
			const elapsed = now - start;
			if (elapsed < duration) {
				const progress = elapsed / duration;
				const currentAngle = progress * targetAngle + (1 - progress) * angle;
				setAngle(currentAngle);
				requestAnimationFrame(animate);
			} else {
				setAngle(targetAngle);
				setIsRotating(false);

				// Calculate the final position of the star
				const finalAngle = targetAngle % (2 * Math.PI);
				const closestIndex = names.reduce((closest, _, index) => {
					const nameAngle = (index / names.length) * 2 * Math.PI;
					const diff = Math.abs(finalAngle - nameAngle);
					return diff < Math.abs(finalAngle - (closest / names.length) * 2 * Math.PI) ? index : closest;
				}, 0);

				// Calculate the position of the closest name
				const radius = 150;
				const centerX = canvasRef.current!.width / 2;
				const centerY = canvasRef.current!.height / 2;
				const nameAngle = (closestIndex / names.length) * 2 * Math.PI;
				const x = centerX + radius * Math.cos(nameAngle - Math.PI / 2);
				const y = centerY + radius * Math.sin(nameAngle - Math.PI / 2);

				setSantaPosition({ x, y });
			}
		};
		animate();
	};

	// const handleReset = () => {
	// 	// setNames([]);
	// 	// setInputNames("");
	// 	setRotationTime(20);
	// 	setIsRotating(false);
	// 	setAngle(0);
	// 	setSantaPosition(null);
	// };

	const drawStar = (ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, points: number, inset: number) => {
		ctx.save();
		ctx.beginPath();
		ctx.translate(x, y);
		ctx.moveTo(0, 0 - radius);
		for (let i = 0; i < points; i++) {
			ctx.rotate(Math.PI / points);
			ctx.lineTo(0, 0 - radius * inset);
			ctx.rotate(Math.PI / points);
			ctx.lineTo(0, 0 - radius);
		}
		ctx.closePath();
		ctx.fillStyle = "yellow";
		ctx.fill();
		ctx.restore();
	};

	const drawSanta = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
		ctx.save();
		ctx.translate(x, y);

		// Draw the star around Santa
		drawStar(ctx, 0, 0, 40, 5, 0.5);

		// Draw Santa's hat
		ctx.fillStyle = "red";
		ctx.beginPath();
		ctx.moveTo(0, -20);
		ctx.lineTo(10, 0);
		ctx.lineTo(-10, 0);
		ctx.closePath();
		ctx.fill();

		// Draw Santa's face
		ctx.fillStyle = "white";
		ctx.beginPath();
		ctx.arc(0, 5, 10, 0, Math.PI * 2);
		ctx.fill();

		// Draw Santa's beard
		ctx.fillStyle = "lightgrey";
		ctx.beginPath();
		ctx.arc(0, 15, 10, 0, Math.PI, true);
		ctx.fill();

		// Draw Santa's eyes
		ctx.fillStyle = "black";
		ctx.beginPath();
		ctx.arc(-3, 3, 1, 0, Math.PI * 2);
		ctx.arc(3, 3, 1, 0, Math.PI * 2);
		ctx.fill();

		ctx.restore();
	};

	return (
		<div className='flex flex-1 gap-2 flex-col max-w-fit'>
			<div className='flex gap-4'>
				<label>rotations tid i sekunder</label>
				<input className='border border-1 rounded' type='number' value={rotationTime} onChange={(e) => setRotationTime(Number(e.target.value))} placeholder='Rotation time in seconds' />
			</div>
			<button onClick={handleStart} disabled={isRotating}>
				Start
			</button>
			{/* <button onClick={handleReset}>Reset</button> */}
			<canvas ref={canvasRef} width={600} height={600} />
			<textarea value={inputNames} onChange={(e) => setInputNames(e.target.value)} placeholder='Enter names separated by commas' />
			<button onClick={() => setNames(inputNames.split(",").map((name) => name.trim()))}>Set Names</button>
		</div>
	);
};
