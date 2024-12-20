import { useRef, useScrollTriggeredCountUp } from "~/libs/hooks/hooks.js";
import styles from "./styles.module.css";

interface Properties {
	end: number;
}

const AnimatedNumber: React.FC<Properties> = ({ end }) => {
	const ref = useRef<HTMLDivElement>(null);
	const count = useScrollTriggeredCountUp(ref, end);

	return (
		<div className={styles["number"]} ref={ref}>
			{count}
		</div>
	);
};

export { AnimatedNumber };
