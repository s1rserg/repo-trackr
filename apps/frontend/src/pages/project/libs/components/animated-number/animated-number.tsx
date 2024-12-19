import styles from "./styles.module.css";
import CountUp from "react-countup";

interface Properties {
	start?: number;
	end: number;
	duration?: number;
}

const AnimatedNumber: React.FC<Properties> = ({
	start = 0,
	end,
	duration = 2.5,
}) => {
	return (
		<CountUp start={start} end={end} duration={duration} />
	);
};

export { AnimatedNumber };
