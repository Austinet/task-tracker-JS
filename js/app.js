let taskForm = document.querySelector("#task-form")
let taskContainer = document.querySelector(".task-container")
let toggleBtn = document.querySelector("#toggleBtn")

//Toggle button at the header
toggleBtn.textContent = "Close"
toggleBtn.addEventListener("click", () => {
    if (toggleBtn.textContent === "Close") {
        toggleBtn.textContent = "Add"
        taskForm.classList.add("hidden")
    } else {
        toggleBtn.textContent = "Close"
        taskForm.classList.remove("hidden")
    }
})

//Database
let taskDB = []

let saveTask = (taskDB) => {
    localStorage.setItem("taskDB", JSON.stringify(taskDB))
    render(taskDB)
}

let retrieveDB = () => {
    return JSON.parse(localStorage.getItem("taskDB"))
}

//Display tasks
let render = (taskDB) => {
    taskDB = retrieveDB()
    if(taskDB !== null) {
        let myTasks = taskDB.map(myTask => {
            return(
              `
              <div class="task-item ${myTask.reminder ? " green-border" : "" } " ondblclick="setReminder(${myTask.id})">
                <div class="details">
                  <h3>${myTask.task}</h3>
                  <p>${myTask.dayTime}</p>
                </div>
                <button id="deleteBtn" onclick="deleteTask(${myTask.id})">x</button>
              </div>
              `
            )
        })
        taskContainer.innerHTML = myTasks.length > 0 ? myTasks.reverse().join("") : `<p>No task to display</p>`
    }
}

render(taskDB)

//Generate unique IDs
let generateID = () => {
  taskDB = retrieveDB()
  let id =  Math.floor(Math.random() * 1000) + 1

  if (taskDB !== null) {
    let checkDuplicateId = taskDB.filter(task => task.id === id)

    if (checkDuplicateId.length > 0) {
      generateID()
    } else {
      return id
    }
  } else {
    return id
  }

}

//Create task
taskForm.addEventListener("submit", (e) => {
    e.preventDefault();
   let task = e.target.task.value
   let dayTime = e.target.dayTime.value
   let reminder = e.target.reminder.checked
   let id = generateID() 

    let newTask = {
        id,
        task,
        dayTime,
        reminder 
    }

    taskDB = retrieveDB()
    if (taskDB === null) {
       taskDB = []
    }
    taskDB.push(newTask)
    
    e.target.task.value = ""
    e.target.dayTime.value = ""
    e.target.reminder.checked = false

    saveTask(taskDB)
})

//Delete task
let deleteTask = (id) => {
    taskDB = retrieveDB()
    taskDB = taskDB.filter(task => task.id !== id)
    saveTask(taskDB)
}

//Toggle reminder
let setReminder = (id) => {
    taskDB = retrieveDB()
    taskDB.forEach(task => {
        if(task.id === id) {
            task.reminder = !task.reminder
        }
    })

    saveTask(taskDB)
} 