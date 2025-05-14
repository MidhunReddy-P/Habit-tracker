let tasks = {};

function addTask() {
  const taskInput = document.getElementById("taskInput").value.trim();
  const dateInput = document.getElementById("dateInput").value;

  if (!taskInput || !dateInput) {
    alert("Please enter both task and date");
    return;
  }

  if (!tasks[dateInput]) {
    tasks[dateInput] = [];
  }

  tasks[dateInput].push({ name: taskInput, count: 0 });
  document.getElementById("taskInput").value = "";
  displayTasks(dateInput);
  updateChart();
}

function displayTasks(date) {
  const taskList = document.getElementById("taskList");
  const selectedDate = document.getElementById("selectedDate");

  selectedDate.textContent = date;
  taskList.innerHTML = "";

  if (!tasks[date]) return;

  tasks[date].forEach((task, index) => {
    const taskDiv = document.createElement("div");
    taskDiv.classList.add("task");
    taskDiv.innerHTML = `
      <span>${task.name}</span>
      <div class="task-actions">
        <button class="btn-increase" onclick="incrementTask('${date}', ${index})">+</button>
        <span class="task-count">${task.count}</span>
        <button onclick="deleteTask('${date}', ${index})">Delete</button>
      </div>
    `;
    taskList.appendChild(taskDiv);
  });
}

function incrementTask(date, index) {
  tasks[date][index].count++;
  displayTasks(date);
  updateChart();
}

function deleteTask(date, index) {
  tasks[date].splice(index, 1);
  if (tasks[date].length === 0) {
    delete tasks[date];
  }
  displayTasks(date);
  updateChart();
}

function updateChart() {
  const ctx = document.getElementById("taskChart").getContext("2d");
  const dates = Object.keys(tasks);
  const taskCounts = dates.map(date =>
    tasks[date].reduce((sum, task) => sum + task.count, 0)
  );

  if (window.taskChartInstance) {
    window.taskChartInstance.destroy();
  }

  window.taskChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: dates,
      datasets: [{
        label: 'Total Habit Counts per Day',
        data: taskCounts,
        backgroundColor: '#4caf50',
        borderRadius: 5
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}
