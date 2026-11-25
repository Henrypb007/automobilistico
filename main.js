* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

body {
    background-color: #0f172a;
    color: #f8fafc;
    min-height: 100vh;
    overflow-x: hidden;
    position: relative;
}

/* Fundo Animado - Carros Voando */
.flying-cars-background {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: -1;
    overflow: hidden;
}

.car-fly {
    position: absolute;
    color: rgba(56, 189, 248, 0.12);
    font-size: 3rem;
    animation: flyAcross 14s linear infinite;
}

.car-1 { top: 15%; animation-duration: 16s; animation-delay: 0s; }
.car-2 { top: 45%; animation-duration: 10s; animation-delay: 3s; font-size: 2.5rem; }
.car-3 { top: 75%; animation-duration: 20s; animation-delay: 1s; font-size: 3.5rem; }

@keyframes flyAcross {
    0% { transform: translateX(-150px) rotate(0deg); opacity: 0; }
    15% { opacity: 0.25; }
    85% { opacity: 0.25; }
    100% { transform: translateX(calc(100vw + 150px)) rotate(5deg); opacity: 0; }
}

.container {
    max-width: 800px;
    margin: 30px auto;
    padding: 20px;
    position: relative;
    z-index: 1;
}

header {
    text-align: center;
    margin-bottom: 30px;
}

header h1 {
    font-size: 2.2rem;
    color: #38bdf8;
    margin-bottom: 10px;
}

header p {
    color: #94a3b8;
}

.card {
    background: rgba(30, 41, 59, 0.88);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    padding: 25px;
    margin-bottom: 25px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
}

.card h2 {
    font-size: 1.4rem;
    margin-bottom: 20px;
    color: #e2e8f0;
    display: flex;
    align-items: center;
    gap: 10px;
}

.form-group {
    margin-bottom: 15px;
}

label {
    display: block;
    margin-bottom: 5px;
    color: #cbd5e1;
    font-size: 0.9rem;
}

input, select {
    width: 100%;
    padding: 12px;
    border-radius: 8px;
    border: 1px solid #475569;
    background: #0f172a;
    color: #fff;
    font-size: 1rem;
}

input:focus, select:focus {
    outline: none;
    border-color: #38bdf8;
}

.btn {
    background-color: #0284c7;
    color: white;
    border: none;
    padding: 12px 20px;
    border-radius: 8px;
    cursor: pointer;
    font-weight: bold;
    font-size: 1rem;
    transition: background 0.2s;
    display: inline-flex;
    align-items: center;
    gap: 8px;
}

.btn:hover {
    background-color: #0369a1;
}

.search-box {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    margin-bottom: 15px;
}

.search-box select, .search-box input {
    flex: 1;
    min-width: 200px;
}

.results-container {
    margin-top: 15px;
    padding: 15px;
    background: #0f172a;
    border-radius: 8px;
    min-height: 70px;
    border: 1px solid #334155;
}

.damage-card {
    background: #1e293b;
    padding: 15px;
    border-radius: 8px;
    margin-bottom: 12px;
    border-left: 4px solid #38bdf8;
}

.damage-card h3 {
    color: #38bdf8;
    margin-bottom: 8px;
    font-size: 1.1rem;
}

.damage-card p {
    margin-bottom: 6px;
    color: #cbd5e1;
    font-size: 0.95rem;
}

.repair-guide {
    margin-top: 8px;
    padding-top: 8px;
    border-top: 1px dashed #475569;
    color: #94a3b8;
    font-size: 0.9rem;
}

/* Estilos de Zoom e Pan */
.zoom-controls {
    display: flex;
    gap: 10px;
    margin-bottom: 15px;
}

.btn-zoom {
    background: #334155;
    color: white;
    border: none;
    padding: 8px 15px;
    border-radius: 6px;
    cursor: pointer;
    transition: background 0.2s;
    display: inline-flex;
    align-items: center;
    gap: 5px;
}

.btn-zoom:hover {
    background: #475569;
}

.zoom-container {
    width: 100%;
    height: 380px;
    overflow: hidden;
    border-radius: 8px;
    background: #000;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    cursor: grab;
}

.zoom-container:active {
    cursor: grabbing;
}

#zoom-image {
    max-width: 100%;
    max-height: 100%;
    transition: transform 0.05s ease-out;
    transform-origin: center center;
    user-select: none;
    pointer-events: none;
}
