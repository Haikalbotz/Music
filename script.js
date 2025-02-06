const audio = document.getElementById('audio');
        const playPauseButton = document.getElementById('play-pause');
        const playIcon = document.getElementById('play-icon');
        const pauseIcon = document.getElementById('pause-icon');
        const coverArt = document.getElementById('cover-art');
        const songTitle = document.getElementById('song-title');
        const artist = document.getElementById('artist');
        const progress = document.getElementById('progress');
        const prevButton = document.getElementById('prev');
        const nextButton = document.getElementById('next');
        const fileInput = document.getElementById('file-input');
        const playlist = document.getElementById('playlist');

        const songs = [];
        let currentSongIndex = 0;

        function loadSong(song) {
            songTitle.textContent = song.title || "Unknown Title";
            artist.textContent = song.artist || "Unknown Artist";
            coverArt.src = song.cover || "https://via.placeholder.com/150";
            audio.src = song.src;
            audio.play();
            playIcon.classList.add('hidden');
            pauseIcon.classList.remove('hidden');
            updatePlaylistUI();
        }

        function playPause() {
            if (audio.paused) {
                audio.play();
                playIcon.classList.add('hidden');
                pauseIcon.classList.remove('hidden');
                coverArt.classList.add('rotate-animation');
            } else {
                audio.pause();
                playIcon.classList.remove('hidden');
                pauseIcon.classList.add('hidden');
                coverArt.classList.remove('rotate-animation');
            }
        }

        function updateProgress() {
            const { duration, currentTime } = audio;
            const progressPercent = (currentTime / duration) * 100;
            progress.value = progressPercent;
        }

        function setProgress() {
            const duration = audio.duration;
            audio.currentTime = (progress.value * duration) / 100;
        }

        function prevSong() {
            currentSongIndex--;
            if (currentSongIndex < 0) {
                currentSongIndex = songs.length - 1;
            }
            loadSong(songs[currentSongIndex]);
        }

        function nextSong() {
            currentSongIndex++;
            if (currentSongIndex > songs.length - 1) {
                currentSongIndex = 0;
            }
            loadSong(songs[currentSongIndex]);
        }

        function handleFileUpload(event) {
            const files = event.target.files;
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const song = {
                    title: file.name.replace(/\.[^/.]+$/, ""), // Menghapus ekstensi file
                    artist: "Uploaded Music",
                    cover: "https://via.placeholder.com/150",
                    src: URL.createObjectURL(file)
                };
                songs.push(song);
            }
            if (songs.length > 0 && currentSongIndex === 0) {
                loadSong(songs[0]);
            }
            updatePlaylistUI();
        }

        function updatePlaylistUI() {
            playlist.innerHTML = songs.map((song, index) => `
                <li class="p-2 hover:bg-gray-700 rounded-lg cursor-pointer ${index === currentSongIndex ? 'bg-gray-700' : ''}" onclick="selectSong(${index})">
                    ${song.title} - ${song.artist}
                </li>
            `).join('');
        }

        function selectSong(index) {
            currentSongIndex = index;
            loadSong(songs[index]);
        }

        playPauseButton.addEventListener('click', playPause);
        audio.addEventListener('timeupdate', updateProgress);
        progress.addEventListener('input', setProgress);
        prevButton.addEventListener('click', prevSong);
        nextButton.addEventListener('click', nextSong);
        fileInput.addEventListener('change', handleFileUpload);

        // Ekspos fungsi selectSong ke global scope
        window.selectSong = selectSong;