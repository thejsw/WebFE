import React, {useState} from "react";
import "./todolist.css";

const TodoList = () => {
	// input value값으로 state 설정
	const [toDo, setToDo] = useState("");
	// toDos 배열로 선언
	const [toDos, setToDos] = useState([]);
	const [editText, setEditText] = useState("");
	const [editIndex, setEditIndex] = useState(null);

	// input 값 변경 시 onChange 함수 실행
	const onChange = event => {
		setToDo(event.target.value);
	};

	// checked 속성을 바꿔줌
	const onToggleCheck = index => {
		setToDos(currentArray => {
			return currentArray.map((item, i) => {
				if (i == index) {
					return {...item, checked: !item.checked};
				}
				return item;
			});
		});
	};

	const onSubmit = event => {
		event.preventDefault();

		const inputValue = editIndex !== null ? editText : toDo;
		if (inputValue === "") {
			alert("no value");
			return;
		}
		if (editIndex !== null) {
			// 수정 모드
			setToDos(currentArray => {
				return currentArray.map((item, i) => {
					if (i === editIndex) {
						return {...item, text: editText}; // 텍스트 수정
					}
					return item;
				});
			});
			setEditIndex(null); // 수정 후 인덱스 초기화
			setEditText(""); // 입력 필드 초기화
		} else {
			// 추가 모드
			setToDos([...toDos, {id: Date.now(), text: toDo, checked: false}]);
			setToDo("");
			console.log(toDos);
		}
	};

	const onEdit = index => {
		setEditIndex(index);
		setEditText(toDos[index].text);
	};

	// remove 함수
	const onRemove = index => {
		// onRemove이벤트로 받는 인자(index)와 i가 일치하면 제거
		setToDos(currentArray =>
			currentArray.filter((_, i) => {
				return i !== index;
			})
		);
	};

	return (
		<>
			<h1 className="title">Todo List</h1>
			<form className="form-box" onSubmit={onSubmit}>
				<input
					id="todo"
					className="todo-input"
					type="text"
					value={editIndex !== null ? editText : toDo}
					onChange={e =>
						editIndex !== null ? setEditText(e.target.value) : setToDo(e.target.value)
					}
				/>
				<span
					id="addBtn"
					className="add-btn"
					role="button"
					onClick={onSubmit}
					onKeyDown={event => {
						if (event.key === "Enter") onSubmit(event);
					}}>
					+
				</span>
			</form>
			<div id="todoBox" className="todo-box">
				{toDos.map((item, index) => (
					<div className="new-todo">
						<button
							className={`check-mark ${item.checked ? "check" : ""}`}
							onClick={() => onToggleCheck(index)}></button>
						<label
							className={`new-todo-label ${item.checked ? "check" : ""}`}
							key={index}>
							{item.text}
							<input
								type="checkbox"
								checked={item.checked}
								onChange={() => onToggleCheck(index)}
							/>
						</label>
						<span className="edit-btn" onClick={() => onEdit(index)}></span>
						<span className="rm-btn" onClick={() => onRemove(index)}></span>
					</div>
				))}
			</div>
		</>
	);
};

export default TodoList;
