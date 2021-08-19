import "../styles/homepage.css";
import Select from "../components/Select";
import Input from "../components/Input";
import Table from "../components/Table";
import { useState, useEffect, useMemo } from "react";
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

	return (
		<div className="homepage">
			{loading ? (
				<div className="loading-view">Loading....</div>
			) : (
				<>
					<h4>Users Dashboard</h4>

					<div className="summary">
						<p>
							<b>Total Users</b>:{users.length}
						</p>
						<p>
							<b>Free Plan Users</b>:
							{users.length - subscriptions.length}
						</p>
						<p>
							<b>Paid Plan Users</b>:{subscriptions.length}
						</p>
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

					<p>Showing {sortedTableContents.length} Users</p>
					<Table
						tableHeaders={tableHeaders}
						tableContents={sortedTableContents}
					/>
				</>
			)}
		</div>
	);
}
