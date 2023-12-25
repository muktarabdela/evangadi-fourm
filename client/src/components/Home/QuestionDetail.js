import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../axios";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";


// react-redux
import { connect } from "react-redux";
import { SHOW_ALERT, STORE_USER } from "../../context/actions";



export const QuestionDetail = ({ user, alert1, storeUser }) => {
	const token = localStorage.getItem("token");
	const navigate = useNavigate();

	const { questionId } = useParams();

	const [question, setQuestion] = useState({});
	const [answers, setAnswers] = useState([]);
	const [answerId, setAnswerId] = useState(null);
	const [userid, setUserid] = useState(null);

	const textDom = useRef();

	useEffect(() => {
		if (user) {
			checkLoggedIn();
		} else {
			navigate("/");
		}
	}, [user, navigate]);

	const checkLoggedIn = async () => {
		try {
			const { data } = await api.get("/users/check", {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			storeUser(data.user);
		} catch (error) {
			console.log(error);
			navigate("/");
		}
	};

	const fetchQuestionAndAnswers = async () => {
		try {
			const [questionData, answersData] = await Promise.all([
				api.get(`/question/one-question/${questionId}`, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}),
				api.get(`/answer/all-answer/${questionId}`, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}),
			]);

			if (questionData.data && questionData.data.question) {
				setQuestion(questionData.data.question);
			}

			if (answersData.data && Array.isArray(answersData.data)) {
				setAnswers(answersData.data);
			}
		} catch (error) {
			console.log("Error while fetching question and answers data:", error.message);
		}
	};

	useEffect(() => {
		fetchQuestionAndAnswers();
	}, [questionId]);

	const postAnswer = async (e, userid) => {
		e.preventDefault();
		try {
			const res = await api.post(`/answer/new-answer/${questionId}`, {
				answer: textDom.current.value,
				userid: userid,
			}, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			if (res.data && res.data.answerid) {
				setAnswerId(res.data.answerid);
				// After posting an answer, refresh the question and answers
				fetchQuestionAndAnswers();
			}
			console.log(res.data);
			textDom.current.value = "";
			console.log("Answer posted successfully");
		} catch (error) {
			console.log("Error posting answer:", error);
			console.log("Failed to post the answer. Please try again.");
		}
	};




	return (
		<>
			<Container>
				<h2 className="my-5">Question</h2>
				<div className="">
					<h4 className=" text-dark">{question.title}</h4>
					<h6>{question.description}</h6>
				</div>
				<hr />
				<h1>Answers From The Community</h1>
				<hr />

				{/* Map through the answers array and render each answer */}
				{answers && Array.isArray(answers) && answers.length > 0 && answers.map((answer, index) => (
					<Row key={index} className="my-5 py-3 shadow">
						<Col
							sm={12}
							md={2}
							className={index % 2 === 0 ? "order-1" : ""}
						>
							<Row>
								<Col sm={12}>
									<i
										className="fa-solid fa-user-tie"
										style={{
											fontSize: "50px",
										}}
									></i>
								</Col>
								<Col sm={12}>
									<h6 className="my-3 text-secondary text-capitalize">
										{answer.username}
									</h6>
								</Col>
							</Row>
						</Col>
						<Col
							sm={12}
							md={10}
							className={index % 2 === 0 ? "text-end px-5" : ""}
						>
							<h6>{answer.answer}</h6>
						</Col>
					</Row>
				))}

				<div className="my-5 text-center">
					<h2>Answer The Above Question</h2>
				</div>
				<Form onSubmit={(e) => postAnswer(e, user.userid)}>
					<div className="my-3">
						<Form.Control
							ref={textDom}
							as="textarea"
							rows="4"
							placeholder="Your Answer..."
						></Form.Control>
					</div>
					<Button type="submit" className="mb-5">
						Post Your Answer
					</Button>
				</Form>
			</Container>
		</>
	);
};

const mapStateToProps = (state) => {
	const { user } = state;
	return { user };
};

const mapDispatchToProps = (dispatch) => ({
	storeUser: (person) => dispatch({ type: STORE_USER, payload: person }),
	alert1: (msg) =>
		dispatch({
			type: SHOW_ALERT,
			payload: msg,
		}),
});

export default connect(mapStateToProps, mapDispatchToProps)(QuestionDetail);
