const tastInput = document.getElementById("task-input")
const dateInput = document.getElementById("date-input")
const addButton = document.getElementById("add-button")
const editButton = document.getElementById("edit-button")
const alertMessage = document.getElementById("alert-message")
const todosBody = document.querySelector("tbody")
const deleteAllButton = document.getElementById("delete-all-button")
const filterButton = document.querySelectorAll(".filter-todos")

let todos = JSON.parse(localStorage.getItem("todos")) || []
const generateId = () => {
    return Math.round(Math.random() * Math.random() * Math.pow(10, 15)).toString()
}
generateId()

const showAlert = (message, type) => {
    alertMessage.innerHTML = ""
    const alert = document.createElement("p")
    alert.innerText = message
    alert.classList.add("alert")
    alert.classList.add(`alert-${type}`)
    alertMessage.append(alert)

    setTimeout(() => {
        alert.style.display = "none"
    }, 2000)
}


const saveToLocalStorage = () => {
    localStorage.setItem("todos", JSON.stringify(todos))
}


const displayTodos = (data) => {
    const todoList = data || todos

    todosBody.innerHTML = ""
    if (!todoList.length) {
        todosBody.innerHTML = "<tr><td colspan='4'> هیچ وظیفه ای پیدا نشد! </td></tr>"
        return
    }
    todoList.forEach(todo => {
        todosBody.innerHTML += `
        <tr>
            <td>${todo.task}</td>
            <td>${todo.date ? todo.date : "تاریخ وارد نشده"}</td>
            <td>${todo.completed ? "انجام شده" : "در انتظار"}</td>
            <td>
                <button onclick="editHandler('${todo.id}')"> ویرایش </button>
                <button onclick="toggleHandler('${todo.id}')"> ${todo.completed ? "بازگشت" : "انجام شده"} </button>
                <button onclick="deleteHandler('${todo.id}', '${todo.task}')"> حذف </button>
            </td >
        </tr > `
    });
}

const addHandler = () => {
    const task = tastInput.value
    const date = dateInput.value
    const todo = {
        id: generateId(),
        completed: false,
        task: task,
        date: date,
    }
    if (task) {
        todos.push(todo)
        saveToLocalStorage()
        displayTodos()
        tastInput.value = ""
        dateInput.value = ""
        showAlert(" اطلاعات با موفقیت ثبت شد ", "success")
    } else {
        showAlert("لطفا یک وظیفه وارد کنید", "error")
    }
}

const deleteAllHandler = () => {
    if (todos.length) {
        todos = []
        saveToLocalStorage()
        displayTodos()
        showAlert(" همه وظیفه ها حذف شد! ", "success")
    } else {
        showAlert(" هیچ وظیفه ای برای پاک کردن وجود ندارد! ", "error")
    }
}

const deleteHandler = (id, task) => {
    const newTodos = todos.filter((todo) => todo.id !== id)
    todos = newTodos
    saveToLocalStorage()
    displayTodos()
    showAlert(`وظیفه --- ${task} --- با موفقیت حذف شد`, `success`)
}


const toggleHandler = (id) => {
    const todo = todos.find((todo) => todo.id === id)
    todo.completed = !todo.completed
    saveToLocalStorage()
    displayTodos()
    showAlert(" تغییر وضعیت انجام شد ", "success")
}

const editHandler = (id) => {
    const todo = todos.find((todo) => todo.id === id)
    tastInput.value = todo.task
    dateInput.value = todo.date
    addButton.style.display = "none"
    editButton.style.display = "inline-block"
    editButton.dataset.id = id
}
const allyEditHandler = (event) => {
    const id = event.target.dataset.id
    const todo = todos.find((todo) => todo.id === id)
    todo.task = tastInput.value
    todo.date = dateInput.value
    tastInput.value = ""
    dateInput.value = ""
    addButton.style.display = "inline-block"
    editButton.style.display = "none"
    saveToLocalStorage()
    displayTodos()
    showAlert(" تغییرات انجام شد ", "success")
}

const filterHander = (event) => {
    let filteredTodos = null
    const filter = event.target.dataset.filter
    switch (filter) {
        case "pending":
            filteredTodos = todos.filter((todo) => todo.completed === false)
            break

        case "completed":
            filteredTodos = todos.filter((todo) => todo.completed === true)
            break

        default:
            filteredTodos = todos
            break
    }
    displayTodos(filteredTodos)
}

window.addEventListener("load", () => displayTodos())
addButton.addEventListener("click", addHandler)
deleteAllButton.addEventListener("click", deleteAllHandler)
editButton.addEventListener("click", allyEditHandler)
filterButton.forEach(button => {
    button.addEventListener("click", filterHander)
})