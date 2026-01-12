import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { splitString, } from '../utils/utils';
import { assertNumber, } from '../types/utilityTypes';

import type *  as Database from '../types/database';
import type { TooltipItem, ChartDataset } from 'chart.js/auto';

type Props = {
	teamMatches: Database.MatchEntry[],
	teamStrategic: Database.StrategicEntry[],
};

function DTFChartComponent(props: Props): React.ReactElement {
	const autonAlgaeCanvas = useRef<HTMLCanvasElement>(null);
	const teleopAlgaeCanvas = useRef<HTMLCanvasElement>(null);
	const autonCoralCanvas = useRef<HTMLCanvasElement>(null);
	const teleopCoralCanvas = useRef<HTMLCanvasElement>(null);

	const teamMatches = props.teamMatches;
	const teamStrategic = props.teamStrategic;

	useEffect(() => {
		if(!(autonAlgaeCanvas.current &&
			teleopAlgaeCanvas.current &&
			autonCoralCanvas.current &&
			teleopCoralCanvas.current
		)) {
			return;
		}
		const matchNumbers = teamMatches.map(function(row) {
			const comp_level = row.comp_level;
			const match_number = row.match_number;

			return comp_level[0].toUpperCase() + match_number.toString();
		});

		function commentCallback(message: string[], items: TooltipItem<'line'>[]): void {
			const dataPoint = items[0];
			const match = teamMatches[dataPoint.dataIndex];
			const match_number = match.match_number;
			const comp_level = match.comp_level;

			const currentTeamMatches = teamMatches.filter((row) => row.match_number === match_number && row.comp_level === comp_level);
			const currentStrategicMatches = teamStrategic.filter((row) => row.match_number === match_number && row.comp_level === comp_level);

			for(const match of currentTeamMatches) {
				message.push("MS: " + match.overall_comments);
			}
			for(const match of currentStrategicMatches) {
				message.push("SS: " + match.comments);
			}
		}

		createChart(autonAlgaeCanvas.current, teamMatches, matchNumbers, {
			"Scored": {
				values: {
					"Net": "auton_algae_scored_net",
					"Processor": "auton_algae_scored_processor",
				},
				calculateAverage: true,
			},
			"Missed": {
				values: {
					"Net": "auton_algae_missed_net",
				},
				calculateAverage: true,
			},
		}, commentCallback);
		createChart(teleopAlgaeCanvas.current, teamMatches, matchNumbers, {
			"Scored": {
				values: {
					"Net": "teleop_algae_scored_net",
					"Processor": "teleop_algae_scored_processor",
				},
				calculateAverage: true,
			},
			"Missed": {
				values: {
					"Net": "teleop_algae_missed_net",
				},
				calculateAverage: true,
			},
		}, commentCallback);
		createChart(autonCoralCanvas.current, teamMatches, matchNumbers, {
			"Scored": {
				values: {
					"L1": "auton_coral_scored_l1",
					"L2": "auton_coral_scored_l2",
					"L3": "auton_coral_scored_l3",
					"L4": "auton_coral_scored_l4",
				},
				calculateAverage: true,
			},
			"Missed": {
				values: {
					"L1": "auton_coral_missed_l1",
					"L2": "auton_coral_missed_l2",
					"L3": "auton_coral_missed_l3",
					"L4": "auton_coral_missed_l4",
				},
				calculateAverage: true,
			},
		}, commentCallback);
		createChart(teleopCoralCanvas.current, teamMatches, matchNumbers, {
			"Scored": {
				values: {
					"L1": "teleop_coral_scored_l1",
					"L2": "teleop_coral_scored_l2",
					"L3": "teleop_coral_scored_l3",
					"L4": "teleop_coral_scored_l4",
				},
				calculateAverage: true,
			},
			"Missed": {
				values: {
					"L1": "teleop_coral_missed_l1",
					"L2": "teleop_coral_missed_l2",
					"L3": "teleop_coral_missed_l3",
					"L4": "teleop_coral_missed_l4",
				},
				calculateAverage: true,
			},
		}, commentCallback);

	}, [autonAlgaeCanvas.current, teleopAlgaeCanvas.current, autonCoralCanvas.current, teleopCoralCanvas.current]);


	return (
		<div className="dtfChart">
			<h2>Auton Algae</h2>
			{<canvas ref={autonAlgaeCanvas}></canvas>}
			<h2>Teleop Algae</h2>
			{<canvas ref={teleopAlgaeCanvas}></canvas>}
			<h2>Auton Coral</h2>
			{<canvas ref={autonCoralCanvas}></canvas>}
			<h2>Teleop Coral</h2>
			{<canvas ref={teleopCoralCanvas}></canvas>}
		</div>
	);
}

type ChartConfig = {
	[name: string]: {
		values: {
			[item_name: string]: string
		},
		calculateAverage?: boolean,
	}
};

function createChart(canvas: HTMLCanvasElement,
	teamMatches: Database.MatchEntry[],
	matchNumbers: string[],
	config: ChartConfig,
	tooltipCallback?: (message: string[], items: TooltipItem<'line'>[]) => void): void {
	const values: ChartDataset<'line'>[] = [];
	const averages: ChartDataset<'line'>[] = [];
	for(const [dataLine, lineOptions] of Object.entries(config)) {
		const doAverage = lineOptions.calculateAverage;
		let average = 0;

		const data = teamMatches.map(function(row) {
			let value = 0;
			for(const [_, item] of Object.entries(lineOptions.values)) {
				// :eyes:
				const itemValue = row[item as keyof typeof row];

				assertNumber(itemValue);
				value += itemValue;
			}

			if(doAverage) {
				average += value;
			}

			return value;
		});

		values.push({
			label: dataLine,
			data: data,
		});

		if(doAverage) {
			if(teamMatches.length > 0) {
				average /= teamMatches.length;
			}
			averages.push({
				label: `Average ${dataLine}`,
				data: Array<number>(teamMatches.length).fill(average),
				pointRadius: 0,
			});
		}
	}

	function tooltip(items: TooltipItem<'line'>[]): string {
		const message = [];
		for(const dataPoint of items) {
			const match = teamMatches[dataPoint.dataIndex];

			// :eyes:
			const entry = config[dataPoint.dataset.label as string].values;

			message.push(`${dataPoint.dataset.label}:`);

			for(const [itemName, dataKey] of Object.entries(entry)) {
				message.push(`${itemName}: ${match[dataKey as keyof typeof match]}`);
			}

			if(tooltipCallback) {
				tooltipCallback(message, items);
			}
		}

		const lineLength = 80;
		const lineSep = "\n";
		const wrappedLines = message.map((l) => splitString(l, lineLength).join(lineSep));

		return wrappedLines.join(lineSep);
	}

	new Chart(canvas, {
		type: 'line',
		data: {
			labels: matchNumbers,
			datasets: [...values, ...averages, ]
		},
		options: {
			plugins: {
				tooltip: {
					callbacks: {
						footer: tooltip,
					}
				}
			}
		}
	});
}

export default DTFChartComponent;
