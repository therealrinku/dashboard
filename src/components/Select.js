import "../styles/select.css";
import { useState } from "react";
import { HiOutlineSelector } from "react-icons/hi";

export default function Select({ currentOption, onChange, options, title }) {
	const [showOptions, setShowOptions] = useState(false);
	const toggleOptions = () => setShowOptions((prev) => !prev);
	const changeOptionAndToggle = (option: string) => {
		onChange(option);
		toggleOptions();
	}; 

	return (
		<div className="select">
			<button
				className="toggle-button"
				onClick={() => setShowOptions((prev) => !prev)}
				type="button"
			>
				<p>{title}</p>
				<HiOutlineSelector />
			</button>

			<section style={!showOptions ? { display: "none" } : undefined}>
				{options.map((option) => {
					return (
						<button
							className="option-button"
							value={option}
							style={
								currentOption === option
									? { color: "#4aa96c" }
									: undefined
							}
							key={option}
							onClick={() => changeOptionAndToggle(option)}
						>
							{option}
						</button>
					);
				})}
			</section>
		</div>
	);
}
