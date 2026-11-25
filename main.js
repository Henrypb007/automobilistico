document.addEventListener('DOMContentLoaded', () => {
    // Carros padrão iniciais
    const defaultCars = [
        { brand: "Chevrolet", model: "Onix", year: 2021 },
        { brand: "Toyota", model: "Corolla", year: 2022 }
    ];

    // Danos padrão para os carros iniciais
    const defaultDamages = [
        { model: "Onix", damage: "para-choque dianteiro riscado", severity: "Leve", cost: "R$ 450,00", repair: "Lixamento da área, aplicação de primer e pintura automotiva." },
        { model: "Onix", damage: "farol quebrado", severity: "Médio", cost: "R$ 800,00", repair: "Substituição do conjunto óptico e regulagem de foco." },
        { model: "Corolla", damage: "amassado na lateral porta", severity: "Alto", cost: "R$ 1.200,00", repair: "Funilaria, repuxamento de chapa e pintura completa da porta." },
        { model: "Corolla", damage: "retrovisor solto", severity: "Leve", cost: "R$ 300,00", repair: "Reaperto de parafusos de fixação ou troca da base interna." }
    ];

    // Funções de Gerenciamento do LocalStorage (Carros)
    function getStoredCars() {
        const stored = localStorage.getItem('user_custom_cars');
        if (!stored) {
            localStorage.setItem('user_custom_cars', JSON.stringify(defaultCars));
            return defaultCars;
        }
        return JSON.parse(stored);
    }

    function saveCarToStorage(car) {
        const cars = getStoredCars();
        // Verifica se já existe ignorando maiúsculas/minúsculas
        const exists = cars.some(c => c.model.toLowerCase() === car.model.toLowerCase());
        if (!exists) {
            cars.push(car);
            localStorage.setItem('user_custom_cars', JSON.stringify(cars));
            return true;
        }
        return false;
    }

    // Funções de Gerenciamento do LocalStorage (Danos)
    function getStoredDamages() {
        const stored = localStorage.getItem('user_custom_damages');
        if (!stored) {
            localStorage.setItem('user_custom_damages', JSON.stringify(defaultDamages));
            return defaultDamages;
        }
        return JSON.parse(stored);
    }

    function saveCustomDamage(dmg) {
        const damages = getStoredDamages();
        damages.push(dmg);
        localStorage.setItem('user_custom_damages', JSON.stringify(damages));
    }

    // Atualizar o seletor mantendo a seleção atual se possível
    function updateCarSelect(keepValue = "") {
        const select = document.getElementById('select-car-model');
        const cars = getStoredCars();
        
        select.innerHTML = '<option value="">Selecione o modelo do carro</option>';
        
        cars.forEach(c => {
            const option = document.createElement('option');
            option.value = c.model;
            option.textContent = `${c.brand} ${c.model} (${c.year})`;
            select.appendChild(option);
        });

        if (keepValue) {
            select.value = keepValue;
        }
    }

    // Inicialização ao carregar a página
    getStoredCars();
    getStoredDamages();
    updateCarSelect();

    // Evento de cadastro de carro
    const carForm = document.getElementById('car-form');
    carForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const brand = document.getElementById('car-brand').value.trim();
        const model = document.getElementById('car-model').value.trim();
        const year = document.getElementById('car-year').value.trim();

        if (brand && model && year) {
            const added = saveCarToStorage({ brand, model, year });
            
            // Adiciona automaticamente um dano genérico inicial para o carro novo não ficar vazio
            saveCustomDamage({
                model: model,
                damage: "Revisão geral de pintura e estrutura",
                severity: "Moderada",
                cost: "R$ 500,00",
                repair: "Inspeção completa, polimento de pequenos riscos e verificação de alinhamento."
            });

            updateCarSelect(model); // Mantém o novo carro selecionado no menu suspenso imediatamente
            carForm.reset();
            alert(`Modelo "${model}" salvo com sucesso e selecionado para pesquisa!`);
        } else {
            alert('Por favor, preencha todos os campos do carro.');
        }
    });

    // Evento de Pesquisa de Danos
    const searchBtn = document.getElementById('search-btn');
    const searchInput = document.getElementById('damage-search-input');
    const selectCar = document.getElementById('select-car-model');
    const resultsContainer = document.getElementById('search-results');

    searchBtn.addEventListener('click', () => {
        const selectedModel = selectCar.value;
        const query = searchInput.value.toLowerCase().trim();

        if (!selectedModel) {
            resultsContainer.innerHTML = '<p style="color: #f87171;">Por favor, selecione um modelo de carro na lista acima antes de pesquisar.</p>';
            return;
        }

        const allDamages = getStoredDamages();

        const filtered = allDamages.filter(item => {
            const matchModel = item.model.toLowerCase() === selectedModel.toLowerCase();
            const matchQuery = query === "" || item.damage.toLowerCase().includes(query) || item.repair.toLowerCase().includes(query);
            return matchModel && matchQuery;
        });

        if (filtered.length > 0) {
            resultsContainer.innerHTML = filtered.map(item => `
                <div class="damage-card">
                    <h3><i class="fa-solid fa-triangle-exclamation"></i> ${item.damage}</h3>
                    <p><strong>Severidade:</strong> ${item.severity} &nbsp;|&nbsp; <strong>Custo Estimado:</strong> ${item.cost}</p>
                    <div class="repair-guide">
                        <strong>Como Reparar:</strong> ${item.repair}
                    </div>
                </div>
            `).join('');
        } else {
            resultsContainer.innerHTML = `
                <div class="damage-card" style="border-left-color: #fbbf24;">
                    <h3 style="color: #fbbf24;">Nenhum dano cadastrado para "${query || 'geral'}" neste modelo.</h3>
                    <p>Deseja adicionar um novo registro de dano para este veículo?</p>
                    <button id="add-new-damage-btn" class="btn" style="margin-top: 8px; padding: 6px 12px; font-size: 0.9rem;">
                        <i class="fa-solid fa-plus"></i> Adicionar Dano Personalizado
                    </button>
                </div>
            `;

            const addDmgBtn = document.getElementById('add-new-damage-btn');
            if (addDmgBtn) {
                addDmgBtn.addEventListener('click', () => {
                    const customDesc = prompt("Descreva o dano encontrado (ex: Arranho na porta):", query || "Dano na lataria");
                    if (customDesc) {
                        saveCustomDamage({
                            model: selectedModel,
                            damage: customDesc,
                            severity: "Média",
                            cost: "R$ 400,00",
                            repair: "Avaliação técnica profissional necessária para o reparo específico."
                        });
                        alert("Dano adicionado com sucesso!");
                        searchBtn.click();
                    }
                });
            }
        }
    });

    // Funcionalidade de Zoom e Movimento da Imagem (Pan)
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

    // Zoom com a roda do mouse
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

    // Arrastar imagem quando estiver com zoom aplicado
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
