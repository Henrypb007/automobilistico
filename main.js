document.addEventListener('DOMContentLoaded', () => {
    // Banco de dados inicial de carros padrão
    const defaultCars = [
        { brand: "Chevrolet", model: "Onix", year: 2021 },
        { brand: "Toyota", model: "Corolla", year: 2022 }
    ];

    // Banco de dados inicial de danos simulados
    const baseDamageDatabase = [
        { model: "Onix", damage: "para-choque dianteiro riscado", cost: "R$ 450,00", severity: "Leve" },
        { model: "Onix", damage: "farol quebrado", cost: "R$ 800,00", severity: "Médio" },
        { model: "Corolla", damage: "amassado na lateral porta", cost: "R$ 1.200,00", severity: "Alto" },
        { model: "Corolla", damage: "retrovisor solto", cost: "R$ 300,00", severity: "Leve" }
    ];

    // Gerenciamento de Carros no LocalStorage
    function getStoredCars() {
        const cars = localStorage.getItem('custom_cars');
        if (!cars) {
            localStorage.setItem('custom_cars', JSON.stringify(defaultCars));
            return defaultCars;
        }
        return JSON.parse(cars);
    }

    function saveCar(car) {
        const cars = getStoredCars();
        // Evitar duplicatas exatas de modelo
        const exists = cars.some(c => c.model.toLowerCase() === car.model.toLowerCase());
        if (!exists) {
            cars.push(car);
            localStorage.setItem('custom_cars', JSON.stringify(cars));
        }
    }

    function updateCarSelect() {
        const select = document.getElementById('select-car-model');
        const cars = getStoredCars();
        
        // Preserva a opção padrão e reconstrói o restante com os carros salvos
        select.innerHTML = '<option value="">Selecione o modelo do carro</option>';
        
        cars.forEach(c => {
            const option = document.createElement('option');
            option.value = c.model;
            option.textContent = `${c.brand} ${c.model} (${c.year})`;
            select.appendChild(option);
        });
    }

    // Inicializar o select imediatamente na abertura da página
    updateCarSelect();

    // Evento de cadastro de carro
    const carForm = document.getElementById('car-form');
    carForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const brand = document.getElementById('car-brand').value.trim();
        const model = document.getElementById('car-model').value.trim();
        const year = document.getElementById('car-year').value.trim();

        if (brand && model && year) {
            saveCar({ brand, model, year });
            updateCarSelect();
            carForm.reset();
            alert('Modelo de carro cadastrado e salvo com sucesso!');
        }
    });

    // Funcionalidade de Pesquisa de Danos
    const searchBtn = document.getElementById('search-btn');
    const searchInput = document.getElementById('damage-search-input');
    const selectCar = document.getElementById('select-car-model');
    const resultsContainer = document.getElementById('search-results');

    searchBtn.addEventListener('click', () => {
        const selectedModel = selectCar.value;
        const query = searchInput.value.toLowerCase().trim();

        if (!selectedModel) {
            resultsContainer.innerHTML = '<p style="color: #f87171;">Por favor, selecione um modelo de carro na lista.</p>';
            return;
        }

        const customDamages = getStoredDamages();
        const allDamages = [...baseDamageDatabase, ...customDamages];

        const filtered = allDamages.filter(item => {
            const matchModel = item.model.toLowerCase() === selectedModel.toLowerCase();
            const matchQuery = query === "" || item.damage.toLowerCase().includes(query);
            return matchModel && matchQuery;
        });

        if (filtered.length > 0) {
            resultsContainer.innerHTML = filtered.map(item => `
                <div class="damage-item">
                    <strong>Dano:</strong> ${item.damage} <br>
                    <strong>Severidade:</strong> ${item.severity} | <strong>Custo Estimado:</strong> ${item.cost}
                </div>
            `).join('');
        } else {
            resultsContainer.innerHTML = `
                <p style="color: #fbbf24; margin-bottom: 10px;">Nenhum registro encontrado para "${query || 'geral'}" neste modelo.</p>
                <button id="add-dummy-damage" class="btn" style="padding: 6px 12px; font-size: 0.9rem;">
                    <i class="fa-solid fa-plus"></i> Registrar este dano para ${selectedModel}
                </button>
            `;
            
            const addBtn = document.getElementById('add-dummy-damage');
            if (addBtn) {
                addBtn.addEventListener('click', () => {
                    saveCustomDamage({ 
                        model: selectedModel, 
                        damage: query || 'Dano geral informado pelo usuário', 
                        cost: 'Sob orçamento', 
                        severity: 'Moderada' 
                    });
                    alert('Dano cadastrado com sucesso! Clique em pesquisar novamente.');
                    searchBtn.click();
                });
            }
        }
    });

    function getStoredDamages() {
        const d = localStorage.getItem('custom_damages');
        return d ? JSON.parse(d) : [];
    }

    function saveCustomDamage(dmg) {
        const damages = getStoredDamages();
        damages.push(dmg);
        localStorage.setItem('custom_damages', JSON.stringify(damages));
    }

    // Funcionalidade de Zoom e Pan (Arraste) Totalmente Operacional
    const zoomImg = document.getElementById('zoom-image');
    const zoomInBtn = document.getElementById('zoom-in');
    const zoomOutBtn = document.getElementById('zoom-out');
    const zoomResetBtn = document.getElementById('zoom-reset');
    const zoomContainer = document.getElementById('zoom-container');

    let scale = 1;
    let pX = 0;
    let pY = 0;
    let isDragging = false;
    let startX, startY;

    function updateTransform() {
        zoomImg.style.transform = `translate(${pX}px, ${pY}px) scale(${scale})`;
    }

    zoomInBtn.addEventListener('click', () => {
        scale = Math.min(scale + 0.3, 4);
        updateTransform();
    });

    zoomOutBtn.addEventListener('click', () => {
        scale = Math.max(scale - 0.3, 1);
        if (scale === 1) { pX = 0; pY = 0; }
        updateTransform();
    });

    zoomResetBtn.addEventListener('click', () => {
        scale = 1;
        pX = 0;
        pY = 0;
        updateTransform();
    });

    // Zoom via roda do mouse com foco no centro
    zoomContainer.addEventListener('wheel', (e) => {
        e.preventDefault();
        if (e.deltaY < 0) {
            scale = Math.min(scale + 0.2, 4);
        } else {
            scale = Math.max(scale - 0.2, 1);
            if (scale === 1) { pX = 0; pY = 0; }
        }
        updateTransform();
    }, { passive: false });

    // Funcionalidade de arrastar imagem (Pan) quando ampliada
    zoomContainer.addEventListener('mousedown', (e) => {
        if (scale > 1) {
            isDragging = true;
            startX = e.clientX - pX;
            startY = e.clientY - pY;
        }
    });

    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        pX = e.clientX - startX;
        pY = e.clientY - startY;
        updateTransform();
    });

    window.addEventListener('mouseup', () => {
        isDragging = false;
    });
});
