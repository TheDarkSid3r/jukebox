$(() => {
    const songButtons = {};
    var playingSong = null;
    var playingSongId = null;

    const playSong = (id) => {
        if (playingSong) playingSong.stop();
        if (id === playingSongId) {
            playingSongId = null;
            playingSong = null;
            return;
        }
        playingSongId = id;
        songButtons[id].addClass("playing")
        const stop = (end) => {
            if (end) {
                playingSongId = null;
                playingSong = null;
            }
            songButtons[id].removeClass("playing");
        };
        playingSong = new Howl({
            src: ["sound/" + id + ".mp3"],
            volume: 1,
            autoplay: true,
            onstop: () => stop(),
            onend: () => stop(true)
        });
    };
    $.getJSON("songs.json", (songs) => {
        songs.forEach((song) => {
            const row = $("<tr/>").appendTo(".songs-table");
            const button = $("<div/>").addClass("song-button").click(() => playSong(song.id));
            songButtons[song.id] = button;
            $("<td/>").addClass("song-button-cell").append(button).appendTo(row);
            $("<td/>").addClass("song-info-cell").append($("<span/>").addClass("song-title").html(song.name), $("<span/>").addClass("song-artist").html(song.artist)).appendTo(row);
            const lyricsHTML = song.parody.replace(/\n/g, "<br/>");
            $("<td/>").addClass("song-lyrics song-lyrics-cell").html(lyricsHTML).appendTo(row);
            $("<tr/>").addClass("song-lyrics-row").append($("<td/>").attr("colspan", 2).addClass("song-lyrics").html(lyricsHTML).appendTo(row)).appendTo(".songs-table");
        });
    });

    var canSuggest = true;
    var suggestionPostTimeout = null;
    const fadePost = (text) => {
        if (suggestionPostTimeout) clearTimeout(suggestionPostTimeout);
        $(".suggestion-post-submit").html(text).fadeIn(300);
        suggestionPostTimeout = setTimeout(() => $(".suggestion-post-submit").fadeOut(300), 2000);
    };
    $(".suggestion").on("submit", (e) => {
        e.preventDefault();
        if (canSuggest) {
            const title = $("#suggestion-songname").val().trim();
            const artist = $("#suggestion-artist").val().trim();
            const details = $("#suggestion-details").val().trim();
            const notSpecified = "*(not specified)*";
            
            $.post("https://discord.com/api/webhooks/829189781756968991/1rDFLxqEE4LkMYJ0WQ8ohh0TsgZ_E7w6mJO0HhcOw-BjSEbWlG-gxdkOpQPlDzDhsCJH", { content: `<@527869303027007490> __**New Parody Request**__\n**Title:** ${title || notSpecified}\n**Artist:** ${artist || notSpecified}\n**Details:** ${details || notSpecified}` }).then(() => fadePost("Successfully submitted request.")).catch(() => fadePost("There was an error submitting your request. Please try again later."));
            $(".suggestion")[0].reset();
            canSuggest = false;
            setTimeout(() => canSuggest = true, 20000);
        } else fadePost("Please wait before submitting another request.");
        return false;
    });
});