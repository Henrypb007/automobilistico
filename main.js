document.addEventListener('DOMContentLoaded', () => {
    // Banco de carros padrão iniciais caso o storage esteja vazio
    const defaultCars = [
        { brand: "Chevrolet", model: "Onix", year: 2021 },
        { brand: "Toyota", model: "Corolla", year: 2022 }
    ];

    // Banco de dados inicial detalhado com reparos e custos
    const baseDamageDatabase = [
        { 
            model: "Onix", 
            damage: "para-choque dianteiro riscado", 
            severity: "Leve", 
            cost: "R$ 450,00", 
            repair: "Lixamento da área afetada, aplicação de primer, pintura automotiva na cor do veículo e polimento final." 
        },
        { 
            model: "Onix", 
            damage: "farol quebrado", 
            severity: "Médio", 
            cost: "R$ 800,00", 
            repair: "Remoção da grade e para-choque parcial, substituição do conjunto óptico danificado e regulagem do facho de luz." 
        },
        { 
            model: "Corolla", 
            damage: "amassado na lateral porta", 
            severity: "Alto", 
            cost: "R$ 1.200,00", 
            repair: "Desamassamento por funilaria tradicional ou martelinho de ouro (dependendo da profundidade), preparo de superfície e pintura completa da peça." 
        },
        { 
            model: "Corolla", 
            damage: "retrovisor solto", 
            severity: "Leve", 
            cost: "R$ 300,00", 
            repair: "Desmontagem da capa interna da porta, reaperto dos parafusos de fixação estrutural ou substituição da base plástica quebrada." 
        }
    ];

    // Gerenciador de Carros (LocalStorage)
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
        // Verificar se já existe modelo igual
        const exists = cars.some(c => c.model.toLowerCase() === car.model.toLowerCase());
        if (!exists) {
            cars.push(car);
            localStorage.setItem('user_custom_cars', JSON.stringify(cars));
            return true;
        }
        return false;
    }

    function updateCarSelect() {
        const select = document.getElementById('select-car-model');
        const cars = getStoredCars();
        
        // Salva o valor selecionado atual se houver
        const currentVal = select.value;

        select.innerHTML = '<option value="">Selecione o modelo do carro</option>';
        
        cars.forEach(c => {
            const option = document.createElement('option');
            option.value = c.model;
            option.textContent = `${c.brand} ${c.model} (${c.year})`;
            select.appendChild(option);
        });

        if (currentVal) {
            select.value = currentVal;
        }
    }

    // Inicializar o seletor logo ao carregar a página
    updateCarSelect();

    // Evento de envio do formulário de cadastro de carro
    const carForm = document.getElementById('car-form');
    carForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const brand = document.getElementById('car-brand').value.trim();
        const model = document.getElementById('car-model').value.trim();
        const year = document.getElementById('car-year').value.trim();

        if (brand && model && year) {
            const added = saveCarToStorage({ brand, model, year });
            if (added) {
                updateCarSelect();
                document.getElementById('select-car-model').value = model; // Seleciona automaticamente o recém criado
                carForm.reset();
                alert('Modelo de carro salvo com sucesso e disponível para pesquisa!');
            } else {
                alert('Este modelo já está cadastrado na lista.');
            }
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
            resultsContainer.innerHTML = '<p style="color: #f87171;">Por favor, selecione um modelo de carro na lista acima.</p>';
            return;
        }

        const customDamages = getStoredDamages();
        const allDamages = [...baseDamageDatabase, ...customDamages];

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
            // Se o usuário buscou um carro recém cadastrado que não tem danos na base, criamos um registro automático de exemplo
            resultsContainer.innerHTML = `
                <div class="damage-card" style="border-left-color: #fbbf24;">
                    <h3 style="color: #fbbf24;">Nenhum dano específico encontrado para "${query || 'geral'}" em ${selectedModel}</h3>
                    <p>Deseja registrar um modelo padrão de análise para este veículo?</p>
                    <button id="auto-create-damage" class="btn" style="margin-top: 8px; padding: 6px 12px; font-size: 0.9rem;">
                        <i class="fa-solid fa-plus"></i> Gerar Dados de Exemplo para ${selectedModel}
                    </button>
                </div>
            `;

            const autoBtn = document.getElementById('auto-create-damage');
            if (autoBtn) {
                autoBtn.addEventListener('click', () => {
                    const newDmg = {
                        model: selectedModel,
                        damage: query || 'Revisão geral de amassados e riscos',
                        severity: 'Moderada',
                        cost: 'R$ 600,00',
                        repair: 'Inspeção visual detalhada, alinhamento de peças plásticas/metálicas e polimento corretivo.'
                    };
                    saveCustomDamage(newDmg);
                    alert('Dados gerados com sucesso! Clique em pesquisar novamente.');
                    searchBtn.click();
                });
            }
        }
    });

    function getStoredDamages() {
        const d = localStorage.getItem('user_custom_damages');
        return d ? JSON.parse(d) : [];
    }

    function saveCustomDamage(dmg) {
        const damages = getStoredDamages();
        damages.push(dmg);
        localStorage.setItem('user_custom_damages', JSON.stringify(damages));
    }

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
