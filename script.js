document.addEventListener("DOMContentLoaded", () => {
  const ingredientsDiv = document.getElementById("ingredients");
  const resultsDiv = document.getElementById("results");
  const savedDiv = document.getElementById("savedRecipes");
  const chartCanvas = document.getElementById("chart");

  let chart;

  function addIngredient(name = "", percent = "") {
    const div = document.createElement("div");
    div.className = "ingredient";
    div.innerHTML = `
      <input placeholder="Name" value="${name}">
      <input type="number" placeholder="%" value="${percent}">
      <button>✕</button>
    `;
    div.querySelector("button").onclick = () => div.remove();
    ingredientsDiv.appendChild(div);
  }

  function autoBalance() {
    const rows = document.querySelectorAll(".ingredient");
    let used = 0;
    rows.forEach((r, i) => {
      if (i < rows.length - 1) used += Number(r.children[1].value) || 0;
    });
    if (rows.length)
      rows[rows.length - 1].children[1].value = (100 - used).toFixed(2);
  }

  function calculate() {
    const total = Number(totalAmount.value);
    const unit = document.getElementById("unit").value;
    const rounding = Number(roundingSelect.value);
    const rows = document.querySelectorAll(".ingredient");

    let sum = 0;
    rows.forEach(r => sum += Number(r.children[1].value) || 0);
    if (sum !== 100) {
      resultsDiv.innerHTML = "<p>Percentages must equal 100%</p>";
      return;
    }

    resultsDiv.innerHTML = "";
    const labels = [];
    const values = [];

    rows.forEach(r => {
      const name = r.children[0].value;
      const percent = Number(r.children[1].value);
      const amount = ((percent / 100) * total).toFixed(rounding);
      labels.push(name);
      values.push(amount);
      resultsDiv.innerHTML += `<p><strong>${name}</strong>: ${amount} ${unit}</p>`;
    });

    if (chart) chart.destroy();
    chart = new Chart(chartCanvas, {
      type: "pie",
      data: {
        labels,
        datasets: [{ data: values }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: "right" }
        }
      }
    });
  }

  function saveRecipe() {
    const name = prompt("Recipe name:");
    if (!name) return;

    const recipe = {
      name,
      total: totalAmount.value,
      unit: unit.value,
      ingredients: [...document.querySelectorAll(".ingredient")].map(r => ({
        name: r.children[0].value,
        percent: r.children[1].value
      }))
    };

    const recipes = JSON.parse(localStorage.getItem("recipes") || "[]");
    recipes.push(recipe);
    localStorage.setItem("recipes", JSON.stringify(recipes));
    loadRecipes();
  }

  function loadRecipes() {
    savedDiv.innerHTML = "";
    const recipes = JSON.parse(localStorage.getItem("recipes") || "[]");
    recipes.forEach(r => {
      const btn = document.createElement("button");
      btn.textContent = r.name;
      btn.onclick = () => loadRecipe(r);
      savedDiv.appendChild(btn);
    });
  }

  function loadRecipe(r) {
    ingredientsDiv.innerHTML = "";
    totalAmount.value = r.total;
    unit.value = r.unit;
    r.ingredients.forEach(i => addIngredient(i.name, i.percent));
  }

  document.getElementById("addBtn").onclick = () => addIngredient();
  document.getElementById("balanceBtn").onclick = autoBalance;
  document.getElementById("calcBtn").onclick = calculate;
  document.getElementById("saveBtn").onclick = saveRecipe;
  document.getElementById("pdfBtn").onclick = () => window.print();
  document.getElementById("darkBtn").onclick = () =>
    document.body.classList.toggle("dark");

  addIngredient("Water", 75);
  addIngredient("Chocolate", 15);
  addIngredient("Hot Water", 10);

  loadRecipes();
});
