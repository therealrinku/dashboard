import "../styles/homepage.css";
import Select from "../components/Select";
import Input from "../components/Input";
import Table from "../components/Table";
import { useState, useEffect } from "react";
import { Doughnut } from "react-chartjs-2";
import axios from "axios";

export default function Homepage() {
	const [sortBy, setSortBy] = useState("Name-Asc");
	const [filterBy, setFilterBy] = useState("No Filter");
	const [searchVal, setSearchVal] = useState("");

	//data
	const [users, setUsers] = useState([]);
	const [subscriptions, setSubscriptions] = useState([]);
	const [loading, setLoading] = useState(true);

	//loading data from the backend
	useEffect(() => {
		const api_url = "https://dashboard-app-100.herokuapp.com";
		axios.get(`${api_url}/users/getUsers`).then((res) => {
			setUsers(res.data);
		});

		axios.get(`${api_url}/subscriptions/getSubscriptions`).then((res) => {
			setSubscriptions(res.data);
			setLoading(false);
		});
	}, []);

	const tableHeaders = [
		"Name",
		"Username",
		"Email",
		"Address",
		"Plan",
		"Joined Date",
	];
	const tableContents = users.map((user) => [
		user.first_name + " " + user.middle_name + " " + user.last_name,
		user.username,
		user.email,
		user.address,
		subscriptions.filter((sub) => parseInt(sub.user_id) === user.id)[0]
			?.package || "Free Plan",
		user.join_date,
	]);

	//searching
	const tableContentsAfterSearch = [];

	for (let e in tableContents) {
		tableContents[e].map((val: any) => {
			const valToCompare = val.toString().toLowerCase();
			if (valToCompare.includes(searchVal.trim().toLowerCase())) {
				if (!tableContentsAfterSearch.includes(tableContents[e])) {
					return tableContentsAfterSearch.push(tableContents[e]);
				}
			}
		});
	}

	//filtering
	const tableContentsAfterFilter = [];

	for (let e in tableContentsAfterSearch) {
		if (filterBy === "No Filter") {
			tableContentsAfterFilter.push(tableContentsAfterSearch[e]);
		} else {
			tableContentsAfterSearch[e].map((val: any) => {
				const valToCompare = val.toString().toLowerCase();
				if (valToCompare === filterBy.trim().toLowerCase()) {
					if (
						!tableContentsAfterFilter.includes(
							tableContentsAfterSearch[e]
						)
					) {
						return tableContentsAfterFilter.push(
							tableContentsAfterSearch[e]
						);
					}
				}
			});
		}
	}

	//sorting
	const sortedTableContents = tableContentsAfterFilter.sort(
		(a: any, b: any) => {
			switch (sortBy) {
				default:
				case "Name-Asc":
					return a[0].localeCompare(b[0]);
				case "Name-Desc":
					return b[0].localeCompare(a[0]);
			}
		}
	);

	const doughnutData = {
		labels: [
			"Free Plan",
			"Plan 1",
			"Plan 2",
			"Plan3",
			"Plan 6",
			"Plan 12",
			"Plan Unlimited",
		],
		datasets: [
			{
				label: "# of Votes",
				data: [
					users.length - subscriptions.length,
					subscriptions.filter((sub) => sub.package === "Plan 1")
						.length,
					subscriptions.filter((sub) => sub.package === "Plan 2")
						.length,
					subscriptions.filter((sub) => sub.package === "Plan3")
						.length,
					subscriptions.filter((sub) => sub.package === "Plan 6")
						.length,
					subscriptions.filter((sub) => sub.package === "Plan 12")
						.length,
					subscriptions.filter(
						(sub) => sub.package === "Plan Unlimited"
					).length,
				],
				backgroundColor: [
					"rgba(255, 99, 132, 0.2)",
					"rgba(54, 162, 235, 0.2)",
					"rgba(255, 206, 86, 0.2)",
					"rgba(75, 192, 192, 0.2)",
					"rgba(153, 102, 255, 0.2)",
					"rgba(255, 159, 64, 0.2)",
				],
				borderColor: [
					"rgba(255, 99, 132, 1)",
					"rgba(54, 162, 235, 1)",
					"rgba(255, 206, 86, 1)",
					"rgba(75, 192, 192, 1)",
					"rgba(153, 102, 255, 1)",
					"rgba(255, 159, 64, 1)",
				],
				borderWidth: 1,
			},
		],
	};

	return (
		<div className="homepage">
			{loading ? (
				<div className="loading-view">Loading....</div>
			) : (
				<>
					<h4>Users Dashboard</h4>

					<div className="summary">
						<Doughnut data={doughnutData} />
					</div>

					<div className="toolbar">
						<Input
							type="text"
							value={searchVal}
							onChange={setSearchVal}
							placeholder="Search here"
						/>
						<span style={{ marginLeft: "6px" }} />
						<Select
							title={`Sort by ${sortBy}`}
							currentOption={sortBy}
							onChange={setSortBy}
							options={["Name-Asc", "Name-Desc"]}
						/>
						<span style={{ marginLeft: "6px" }} />
						<Select
							title={`Filter by ${filterBy}`}
							currentOption={filterBy}
							onChange={setFilterBy}
							options={[
								"No Filter",
								"Plan 1",
								"Plan 2",
								"Plan3",
								"Plan 6",
								"Plan 12",
								"Plan Unlimited",
								"Free Plan",
							]}
						/>
					</div>

					<Table
						tableHeaders={tableHeaders}
						tableContents={sortedTableContents}
					/>
				</>
			)}
		</div>
	);
}
