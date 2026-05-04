let isPlaying = false, currentSong = 0;
const songs = ['Know Me To well.mp3','di saat sendiri.mp3','aku,kamu,dan samudera.mp3','Tanpa tergesa.mp3'];
const audio = document.getElementById('audio'), app = document.getElementById('app'), wrapper = document.getElementById('wrapper');
let adjMatrix = [[0,1,1,0],[1,0,0,1],[1,0,0,0],[0,1,0,0]];
let graphType = 'adjacency', customMatrix = [[0,1,1,0],[1,0,0,1],[1,0,0,0],[0,1,0,0]];

function enterApp() {
    wrapper.style.display = 'none'; app.style.display = 'flex';
    loadSong(); audio.play(); isPlaying = true;
    drawGraphToolkit(); login(); drawMatrixTable();
}

function loadSong() { audio.src = songs[currentSong]; document.getElementById('current-song').textContent = `Lagu ${currentSong+1}`; }

function togglePlay() { isPlaying = !isPlaying; if(isPlaying) audio.play(); else audio.pause(); }
function prevSong() { currentSong = (currentSong-1+4)%4; loadSong(); }
function nextSongGraph() {
    for(let next=0; next<4; next++) if(adjMatrix[currentSong][next]){ currentSong=next; loadSong(); highlightCell(currentSong,next); return; }
    currentSong = (currentSong+1)%4; loadSong();
}

function shareGraph() {
    const data = {matrix: adjMatrix, type: graphType, current: currentSong};
    navigator.clipboard.writeText(`Music Graph: ${JSON.stringify(data)}
${window.location.href}`);
    alert('Graph matrix + state disalin!');
}

function login() { document.getElementById('status').textContent = 'Graph Lab Active!'; }
function addToPlaylist() {
    const list = document.getElementById('playlist-list'), li = document.createElement('li');
    li.textContent = `Lagu${currentSong+1} [Graph:${graphType}]`;
    list.appendChild(li);
}

// GRAPH TOOLKIT - CORE
function drawGraphToolkit() {
    const html = `
    <select id="graph-type" onchange="changeGraphType(this.value)">
        <option value="adjacency">Adjacency Matrix</option>
        <option value="subgraph">Subgraph</option>
        <option value="labeled">Labeled/Weighted</option>
        <option value="mst">Min Spanning Tree</option>
        <option value="bfs">BFS Traversal</option>
        <option value="dfs">DFS Traversal</option>
    </select>
    <div id="matrix-inputs"></div>
    <button onclick="runGraphAlgorithm()">⚡ Run Algorithm</button>
    <div id="graph-result"></div>`;
    document.getElementById('graph-toolkit').innerHTML = html;
    updateMatrixInputs();
}

function updateMatrixInputs() {
    let html = '<table>';
    for(let i=0; i<4; i++) {
        html += '<tr>';
        for(let j=0; j<4; j++) {
            html += `<td><input type="number" min="0" max="10" value="${customMatrix[i][j]}" 
                     id="m-${i}-${j}" onchange="customMatrix[${i}][${j}]=parseInt(this.value)||0"></td>`;
        }
        html += '</tr>';
    }
    html += '</table>';
    document.getElementById('matrix-inputs').innerHTML = html;
}

function changeGraphType(type) {
    graphType = type;
    if(type==='labeled') for(let i=0;i<4;i++)for(let j=0;j<4;j++) customMatrix[i][j]=Math.floor(Math.random()*10)+1;
    else if(type==='subgraph') customMatrix=[[1,1,0,0],[1,1,0,0],[0,0,0,0],[0,0,0,0]];
    else if(type==='mst') customMatrix=[[0,2,3,0],[2,0,1,4],[3,1,0,2],[0,4,2,0]];
    updateMatrixInputs();
}

function runGraphAlgorithm() {
    const result = document.getElementById('graph-result');
    let output = `<h4>📊 ${graphType.toUpperCase()} RESULT</h4><pre>`;
    
    if(graphType==='adjacency') {
        adjMatrix = customMatrix.map(r=>r.map(v=>v>0?1:0));
        output += `Matrix Applied:
${JSON.stringify(adjMatrix)}`;
        drawMatrixTable();
    }
    else if(graphType==='subgraph') {
        const sub = customMatrix.slice(0,2).map(r=>r.slice(0,2));
        output += `Subgraph 2x2:
${JSON.stringify(sub)}`;
    }
    else if(graphType==='labeled') {
        output += `Weighted Edges:
L0-L1=${customMatrix[0][1]}, L1-L3=${customMatrix[1][3]}`;
    }
    else if(graphType==='mst') {
        const mstCost = customMatrix[0][1] + customMatrix[0][2] + customMatrix[1][3];
        output += `MST Edges: 0→1, 0→2, 1→3
Total Cost: ${mstCost}`;
    }
    else if(graphType==='bfs') {
        const path = bfsFromZero();
        output += `BFS Path: ${path.join(' → ')}`;
    }
    else if(graphType==='dfs') {
        const path = dfsFromZero();
        output += `DFS Path: ${path.join(' → ')}`;
    }
    
    result.innerHTML = output + '</pre>';
    adjMatrix = customMatrix.map(r=>r.map(v=>v>0?1:0));
}

function bfsFromZero() {
    const visited = [false,false,false,false], queue=[0], path=[0];
    while(queue.length) {
        const curr = queue.shift();
        for(let next=0; next<4; next++) {
            if(adjMatrix[curr][next] && !visited[next]) {
                visited[next]=true; queue.push(next); path.push(next);
            }
        }
    }
    return path;
}

function dfsFromZero() {
    const path = [], visited = [false,false,false,false];
    function dfs(curr) {
        visited[curr]=true; path.push(curr);
        for(let next=0; next<4; next++) {
            if(adjMatrix[curr][next] && !visited[next]) dfs(next);
        }
    }
    dfs(0);
    return path;
}

function drawMatrixTable() {
    let html = '<table><tr><th></th><th>L1</th><th>L2</th><th>L3</th><th>L4</th></tr>';
    for(let i=0; i<4; i++) {
        html += `<tr><th>L${i+1}</th>`;
        for(let j=0; j<4; j++) {
            html += `<td style="background:${adjMatrix[i][j]?'#ff6b6b':'#444'};color:white">${adjMatrix[i][j]}</td>`;
        }
        html += '</tr>';
    }
    html += '</table>';
    document.getElementById('graph-result').innerHTML += `<div style="margin-top:10px;">${html}</div>`;
}

function highlightCell(row,col) {
    setTimeout(() => {
        const cell = document.querySelector(`#graph-toolkit table td:nth-child(${col+2})`);
        if(cell) {
            cell.style.background = '#4ecdc4';
            setTimeout(()=>cell.style.background='#ff6b6b',1000);
        }
    },100);
}

function showFlowchart() {
    const cont = document.getElementById('flowchart-container');
    cont.style.display = cont.style.display==='none' ? 'block' : 'none';
    if(cont.style.display==='block') mermaid.init(undefined, document.querySelectorAll('.mermaid'));
}

// Inisialisasi
function initApp() { drawGraphToolkit(); }