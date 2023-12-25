import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import Button from "react-bootstrap/Button";

// react-redux
import { connect } from "react-redux";

// actions
import { SHOW_ALERT, STORE_USER } from "../../context/actions";
import api from "../../axios";

export const Home = ({ user, alert, storeUser }) => {
	const [questions, setQuestions] = useState([]);
	const [users, setUsers] = useState([]);
	const navigate = useNavigate();
	const token = localStorage.getItem("token");

	useEffect(() => {
		if (token) {
			checkLogedIn();
		} else {
			navigate("/");
		}
	}, []);

	const checkLogedIn = async () => {
		try {
			const { data } = await api.get(
				"/users/check",
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}

			);
			setUsers(data);
			storeUser(data.user);
			await fetchQuestions();
		} catch (error) {
			console.log(error.response);
			alert("Please log in to your account first.");
			navigate("/");
		}
	};

	const fetchQuestions = async () => {
		try {
			const token = localStorage.getItem("token");

			if (!token) {
				return navigate("/");
			}

			const { data } = await api.get("/question/all-questions", {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			console.log(data);
			setQuestions(data.questions);
		} catch (error) {
			console.log(error.response);
		}
	};


	return (
		<>
			<Container className="py-5">
				<Row className="my-5">
					<Col sm={12} md={8}>
						<Link to="/ask">
							<Button>Ask Question</Button>
						</Link>
					</Col>
					<Col sm={12} md={4}>
						<h4>
							welcome : {"  "}
							<span className="text-secondary">{users.username}</span>
						</h4>
					</Col>
				</Row>
				<h3 className="my-5">Questions</h3>
				{/* map */}

				{questions?.map((el) => {
					return (
						<Link
							key={el.questionid}
							to={`/question/${el.questionid}`}
							className="text-decoration-none text-secondary"
						>
							<hr />
							<Row>
								<Col sm={12} md={3} xl={2}>
									<Row>
										<Col sm={12}>
											<i
												className="fa-solid fa-user-tie"
												style={{
													fontSize: "80px",
												}}
											></i>
										</Col>
										<Col sm={12}>
											<h6 className="my-3 text-secondary text-capitalize">
												{el.username}
											</h6>
										</Col>

									</Row>
								</Col>
								<Col xs={11} md={8} xl={9}>
									<h6>{el.title}</h6>
								</Col>
								<Col xs={1} md={1}>
									<i
										className="fa-solid fa-angle-right py-md-5"
										style={{
											fontSize: "30px",
										}}
									></i>
								</Col>

							</Row>
							<hr />
						</Link>
					);
				})}
			</Container>

		</>
	);
};

const mapStateToProps = (state) => {
	const { user } = state;
	return { user };
};

const mapDispatchToProps = (dispatch) => {
	return {
		storeUser: (person) => dispatch({ type: STORE_USER, payload: person }),

		alert: (msg) =>
			dispatch({
				type: SHOW_ALERT,
				payload: msg,
			}),
	};
};
export default connect(mapStateToProps, mapDispatchToProps)(Home);
