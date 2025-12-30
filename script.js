const ingredientContainer = document.getElementById('ingredients'); const resultsDiv = document.getElementById('results'); const savedRecipesDiv = document.getElementById('savedRecipes'); const chartCanvas = document.getElementById('chart'); let chart;

function addIngredient(name = '', percent = '') { const div = document.createElement('div'); div.className = 'ingredient'; div.innerHTML = <input placeholder="Name" value="${name}"> <input type="number" placeholder="%" value="${percent}"> <button onclick="this.parentElement.remove()">✕</button>; ingredientContainer.appendChild(div); }

addIngredient('Water', 75); addIngredient('Chocolate', 15); addIngredient('Hot Water', 10);

function autoBalance() { const rows = document.querySelectorAll('.ingredient'); let used = 0; rows.forEach((r, i) => { if (i < rows.length - 1) used += +r.children[1].value || 0; }); rows[rows.length - 1].children[1].value = (100 - used).toFixed(2); }

function calculate() { const total = +document.getElementById('totalAmount').value; const unit = document.getElementById('unit').value; const rounding = +document.getElementById('rounding').value; const rows = document.querySelectorAll('.ingredient');

resultsDiv.innerHTML = ''; let sum = 0; rows.forEach(r => sum += +r.children[1].value || 0); if (sum !== 100) return resultsDiv.innerHTML = '<p>Percentages must equal 100%</p>';

const labels = []; const values = [];

rows.forEach(r => { const name = r.children[0].value; const percent = +r.children[1].value; const amount = ((percent / 100) * total).toFixed(rounding); labels.push(name); values.push(amount); resultsDiv.innerHTML += <p><strong>${name}</strong>: ${amount} ${unit}</p>; });

drawChart(labels, values); }

function drawChart(labels, data) { if (chart) chart.destroy(); chart = new Chart(chartCanvas, { type: 'pie', data: { labels, datasets: [{ data }] } }); }

function saveRecipe() { const name = prompt('Recipe name:'); if (!name) return; const recipe = { name, total: totalAmount.value, unit: unit.value, ingredients: [...document.querySelectorAll('.ingredient')].map(r => ({ name: r.children[0].value, percent: r.children[1].value })) }; const recipes = JSON.parse(localStorage.getItem('recipes') || '[]'); recipes.push(recipe); localStorage.setItem('recipes', JSON.stringify(recipes)); loadRecipes(); }

function loadRecipes() { savedRecipesDiv.innerHTML = ''; const recipes = JSON.parse(localStorage.getItem('recipes') || '[]'); recipes.forEach(r => { const btn = document.createElement('button'); btn.textContent = r.name; btn.onclick = () => loadRecipe(r); savedRecipesDiv.appendChild(btn); }); }

function loadRecipe(r) { ingredientContainer.innerHTML = ''; totalAmount.value = r.total; unit.value = r.unit; r.ingredients.forEach(i => addIngredient(i.name, i.percent)); }

function toggleDarkMode() { document.body.classList.toggle('dark'); }

function exportPDF() { window.print(); }

loadRecipes();