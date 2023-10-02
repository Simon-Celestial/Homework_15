import React, {useCallback, useEffect, useState} from "react";
import "./TodoListApp.css";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircleXmark} from "@fortawesome/free-solid-svg-icons";
import {DragDropContext, Draggable, Droppable} from "react-beautiful-dnd";

const generateId = (size = 20) => {
    return new Array(size)
        .fill(0)
        .map(() => 'qwertyuiopasdfghjkjlzxcvbnm'[Math.floor(Math.random() * 27)]).join('');
}
const lists = ['OPEN', 'IN PROGRESS', 'CLOSED'];
const TodoListApp = () => {

    let [tasks, setTasks] = useState([
        [],
        [],
        []
    ]);
    const [firstEntry, setFirstEntry] = useState(false);
    let [taskInput, setTaskInput] = useState("");

    const removeTask = (index, list = 0) => {
        const updatedTasks = [...tasks];
        setFirstEntry(true);
        updatedTasks[list] = updatedTasks[list].filter((it, i) => i !== index);
        setTasks(updatedTasks);
    };
    const clearInput = () => {
        setTaskInput("");
    }
    const handleInputChange = (e) => {
        setTaskInput(e.target.value);
    };

    useEffect(() => {
        (async () => {
            const dbContent = await fetch('http://localhost:5000/getDB').then(res => res.text());
            setTasks(JSON.parse(dbContent));
        })();
    }, [])

    useEffect(() => {
        if (!firstEntry) return;
        (async () => {
            await fetch('http://localhost:5000/save', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    filename: 'db.json',
                    content: JSON.stringify(tasks, null, 2)
                }),
            })
        })();
    }, [tasks, firstEntry]);

    const addTask = useCallback(() => {
        if (taskInput.length === 0) {
            alert("Can't add an empty tak!")
            setTaskInput("");
        } else {
            setFirstEntry(true);
            setTasks(prev => [
                [...prev[0], {
                    label: taskInput,
                    id: generateId(),
                }],
                [...prev[1]],
                [...prev[2]]
            ]);
            setTaskInput("");
        }
    }, [taskInput])
    const onDragEnd = (param) => {
        const {
            source: {index: sourceIndex, droppableId: sourceListIndex} = {},
            destination: {index: destinationIndex, droppableId: destinationListIndex} = {},
        } = param;
        if (!sourceListIndex) return;
        if (!destinationListIndex) return;
        console.log(param);

        setFirstEntry(true);
        setTasks(prev => {
            const updated = [...prev];
            const sourcelistNumber = Number(sourceListIndex.replace('list_', ''));
            const destinationListNumber = Number(destinationListIndex.replace('list_', ''));

            console.log({sourcelistNumber, destinationListNumber})
            if (sourceListIndex === destinationListIndex) {
                [
                    updated[sourcelistNumber][sourceIndex],
                    updated[sourcelistNumber][destinationIndex]
                ] =
                    [
                        updated[sourcelistNumber][destinationIndex],
                        updated[sourcelistNumber][sourceIndex]
                    ];
            } else {
                const [removed] = updated[sourcelistNumber].splice(sourceIndex, 1);
                updated[destinationListNumber].splice(destinationIndex, 0, removed);
            }

            return updated;
        });
    }
    console.log(tasks)
    return (
        <div className="to-do-list">
            <div className="app-wrapper">
                    <span>
                        <h1>TO DO LIST</h1>
                    </span>
                <div className="app-content" id="appContent">
                    <div className="task-block">
                        <button type="button" id="addBtn" onClick={addTask}>ADD TASK</button>
                        <div className="task-input">
                            <input
                                type="text"
                                placeholder="Enter task"
                                id="input"
                                onChange={handleInputChange}
                                value={taskInput}/>
                            <FontAwesomeIcon icon={faCircleXmark} className="x-mark" onClick={clearInput}/>
                        </div>
                    </div>
                </div>
            </div>
            <DragDropContext onDragEnd={onDragEnd}>
                <div className="tasks-wrapper">
                    {lists.map((label, listIndex) => (
                        <div className="task-column" key={label}>
                            <div className="task-type">
                                <h1>{label}</h1>
                            </div>
                            <Droppable droppableId={`list_${listIndex}`}>
                                {(provided, snapshot) => (
                                    <div
                                        className="tasks-item"
                                        ref={provided.innerRef}
                                        style={{backgroundColor: snapshot.isDraggingOver ? 'blue' : 'grey'}}
                                        {...provided.droppableProps}>
                                        {tasks[listIndex].map((task, taskIndex) => (
                                            <Draggable
                                                key={task.id}
                                                draggableId={task.id}
                                                index={taskIndex}>
                                                {(providedInner) => (
                                                    <p
                                                        ref={providedInner.innerRef}
                                                        {...providedInner.draggableProps}
                                                        {...providedInner.dragHandleProps}>
                                                        {task.label}
                                                        <FontAwesomeIcon
                                                            icon={faCircleXmark}
                                                            className="remove-task"
                                                            onClick={() => removeTask(taskIndex, listIndex)}
                                                        />
                                                    </p>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </div>
                    ))}
                </div>
            </DragDropContext>
        </div>
    );
}
export default TodoListApp;
