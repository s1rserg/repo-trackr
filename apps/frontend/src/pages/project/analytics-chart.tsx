import {
	Bar,
	BarChart,
	CartesianGrid,
	Legend,
	Line,
	LineChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";

const AnalyticsGraphs = () => {
	const mockData = [
		{ name: "Jan", visitors: 400, pulls: 240 },
		{ name: "Feb", visitors: 300, pulls: 139 },
		{ name: "Mar", visitors: 200, pulls: 980 },
		{ name: "Apr", visitors: 278, pulls: 390 },
		{ name: "May", visitors: 189, pulls: 480 },
		{ name: "Jun", visitors: 239, pulls: 380 },
		{ name: "Jul", sales: 430, pulls: 349 },
	];

	return (
		<div style={{ display: "flex" }}>
			<h2>Mock Analytics Dashboard</h2>

			{/* Line Chart */}
			<div style={{ width: "100%", height: 300 }}>
				<h3>Monthly Commits</h3>
				<ResponsiveContainer>
					<LineChart data={mockData}>
						<CartesianGrid strokeDasharray="3 3" />
						<XAxis dataKey="name" />
						<YAxis />
						<Tooltip />
						<Legend />
						<Line
							type="monotone"
							dataKey="visitors"
							stroke="#8884d8"
							activeDot={{ r: 8 }}
						/>
					</LineChart>
				</ResponsiveContainer>
			</div>

			{/* Bar Chart */}
			<div style={{ width: "100%", height: 300 }}>
				<h3>Monthly Pull Requests</h3>
				<ResponsiveContainer>
					<BarChart data={mockData}>
						<CartesianGrid strokeDasharray="3 3" />
						<XAxis dataKey="name" />
						<YAxis />
						<Tooltip />
						<Legend />
						<Bar dataKey="pulls" fill="#82ca9d" />
					</BarChart>
				</ResponsiveContainer>
			</div>
		</div>
	);
};

export default AnalyticsGraphs;
