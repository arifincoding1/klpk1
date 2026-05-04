let currentSong = 0;
let isPlaying = false;

// 🔥 GANTI SESUAI FILE KAMU
const songs = [
  { title: "Lagu 1", file: "C:\Users\bitch\Downloads\di saat sendiri.mp3" },
  { title: "Lagu 2", file: "C:\Users\bitch\Downloads\Know Me To well.mp3" },
  { title: "Lagu 3", file: "C:\Users\bitch\Downloads\aku,kamu,dan samudera.mp3" },
  { title: "Lagu 4", file: "C:\Users\bitch\Downloads\Tanpa tergesa.mp3" }
];

const audio = document.getElementById("audio");

// GRAPH
let adjMatrix = [
  [0,1,1,0],
  [1,0,0,1],
  [1,0,0,0],
  [0,1,0,0]
];

// ================= START =================
function enterApp() {
  document.getElementById("wrapper").style.display = "none";
  document.getElementById("app").style.display = "block";

  loadSong();
}

// ================= AUDIO =================
function loadSong() {
  const song = songs[currentSong];

  audio.src = song.file;
  document.getElementById("current-song").textContent = song.title;

  console.log("Load:", song.file);

  audio.onerror = () => {
    alert("ERROR: File tidak ditemukan → " + song.file);
  };
}

function togglePlay() {
  if (audio.paused) {
    audio.play().then(() => {
      isPlaying = true;
    }).catch(() => {
      alert("Klik dulu layar biar audio bisa play!");
    });
  } else {
    audio.pause();
    isPlaying = false;
  }
}

function prevSong() {
  currentSong = (currentSong - 1 + songs.length) % songs.length;
  loadSong();
}

function nextSongGraph() {
  for (let i = 0; i < songs.length; i++) {
    if (adjMatrix[currentSong][i]) {
      currentSong = i;
      loadSong();
      return;
    }
  }

  currentSong = (currentSong + 1) % songs.length;
  loadSong();
}

// ================= GRAPH =================
function bfs() {
  const visited = [false,false,false,false];
  const queue = [0];
  const path = [];

  visited[0] = true;

  while(queue.length) {
    const node = queue.shift();
    path.push(node);

    for(let i=0;i<4;i++) {
      if(adjMatrix[node][i] && !visited[i]) {
        visited[i] = true;
        queue.push(i);
      }
    }
  }

  return path;
}

// TEST OUTPUT BIAR KELIATAN
window.onload = () => {
  console.log("BFS:", bfs());
};
