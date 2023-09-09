(function () {
    let saveAlbum = document.querySelector("#saveAlbum");
    let downloadAlbum = document.querySelector("#downloadAlbum");
    let importAlbum = document.querySelector("#importAlbum");
    let addAlbum = document.querySelector("#addAlbum");
    let deleteAlbum = document.querySelector("#deleteAlbum");
    let playAlbum = document.querySelector("#playAlbum");
    let selectAlbum = document.querySelector("#selectAlbum");
    let template = document.querySelector("#allTemplate");
    let overlay = document.querySelector("#overlay");
    let playOverlay = document.querySelector("#play-overlay");
    let contentDetailOverlay = document.querySelector("#content-detail-overlay");
    let createSlide = document.querySelector("#create-slide");
    let showSlide = document.querySelector("#show-slide");
    let newSlide = document.querySelector("#new-slide");
    let saveBtn = document.querySelector("#savebtn");
    let slideImgUrl = document.querySelector("#slide-Img-url");
    let slideTitle = document.querySelector("#slide-title");
    let slideTextarea = document.querySelector("#slide-textarea");
    let slideList = document.querySelector("#slide-list");
    let uploadAlbum = document.querySelector("#uploadFile")

    let albums = [];


    addAlbum.addEventListener("click", handleAddAlbum);
    selectAlbum.addEventListener("change", handleSelectAlbum);
    deleteAlbum.addEventListener("click", handleDeleteAlbum);
    newSlide.addEventListener("click", handleNewSlideClick);
    saveBtn.addEventListener("click", handleSaveSlide);
    saveAlbum.addEventListener("click", saveToLocalStorage);
    downloadAlbum.addEventListener("click", handleDownloadAlbum);
    importAlbum.addEventListener("click", function () {
        if (selectAlbum.value == "-1") {
            alert("please select album to import data");
            return;
        }
        uploadAlbum.click();
    });

    uploadAlbum.addEventListener("change", handleImportAlbum);
    playAlbum.addEventListener("click", handlePlayAlbum);



    function handleAddAlbum() {
        let albumName = prompt("enter the album name ");
        if (albumName == null) {
            return;
        }
        albumName = albumName.trim();
        if (!albumName) {
            alert("empty name is not allowed");
            return;
        }
        let exists = albums.some(a => a.name == albumName);
        if (exists) {
            alert(albumName + "it already exist try new name ");
            return;
        }

        let album = {
            name: albumName,
            slides: []
        }
        albums.push(album);

        let optionTemplate = template.content.querySelector("[purpose='new-album']");
        let newSlideOption = document.importNode(optionTemplate, true);

        newSlideOption.setAttribute("value", albumName);
        newSlideOption.innerHTML = albumName;
        selectAlbum.appendChild(newSlideOption);
        selectAlbum.value = albumName;
        selectAlbum.dispatchEvent(new Event("change"));

    }
    function handleSelectAlbum() {
        if (this.value == -1) {
            overlay.style.display = "block";
            contentDetailOverlay.style.display = "none";
            createSlide.style.display = "none";
            showSlide.style.display = "none";

            slideList.innerHTML = "";
        } else {
            overlay.style.display = "none";
            contentDetailOverlay.style.display = "block";
            createSlide.style.display = "none";
            showSlide.style.display = "none";

            let album = albums.find(a => a.name == selectAlbum.value);
            slideList.innerHTML = "";

            for (let i = 0; i < album.slides.length; i++) {
                let optionTemplate = template.content.querySelector(".slides");
                let slide = document.importNode(optionTemplate, true);

                slide.querySelector(".title").innerHTML = album.slides[i].title;
                slide.querySelector(".desc").innerHTML = album.slides[i].desc;
                slide.querySelector("img").setAttribute("src", album.slides[i].url);

                slide.addEventListener("click", handleSlideClick);

                album.slides[i].selected = false;

                slideList.append(slide);
            }
        }
    }
    function handleDeleteAlbum() {
        if (selectAlbum.value == "-1") {
            alert("please select an album for delete");
        }

        // delete from album array
        let aidx = albums.findIndex(a => a.name == selectAlbum.value);
        albums.splice(aidx, 1);

        // delete from drop down
        selectAlbum.remove(selectAlbum.selectedIndex);

        selectAlbum.value = "-1";
        selectAlbum.dispatchEvent(new Event("change"));

    }
    function handleDownloadAlbum() {
        if (selectAlbum.value == "-1") {
            alert("please slect album to download");
            return;
        }
        let album = albums.find(a => a.name == selectAlbum.value);
        let ajson = JSON.stringify(album);
        let encodedjson = encodeURIComponent(ajson);

        let a = document.createElement("a");

        a.setAttribute("href", "data:text/json;charset=utf-8," + encodedjson);
        a.setAttribute("download", album.name + ".json");

        a.click();
    }
    function handleImportAlbum() {
        if (selectAlbum.value == "-1") {
            alert("please slect album to download");
            return;
        }
        let file = window.event.target.files[0];
        let reader = new FileReader();
        reader.addEventListener("load", function () {
            let data = window.event.target.result;
            let importedAlbum = JSON.parse(data);

            let album = albums.find(a => a.name == selectAlbum.value);
            album.slides = album.slides.concat(importedAlbum.slides);

            slideList.innerHTML = "";
            for (let i = 0; i < album.slides.length; i++) {
                let optionTemplate = template.content.querySelector(".slides");
                let slide = document.importNode(optionTemplate, true);

                slide.querySelector(".title").innerHTML = album.slides[i].title;
                slide.querySelector(".desc").innerHTML = album.slides[i].desc;
                slide.querySelector("img").setAttribute("src", album.slides[i].url);

                slide.addEventListener("click", handleSlideClick);

                album.slides[i].selected = false;

                slideList.append(slide);
            }

        })
        reader.readAsText(file);

    }
    function handlePlayAlbum() {
        if (selectAlbum.value == "-1") {
            alert("please slect album to play");
            return;
        }
        playOverlay.style.display = "block";
        playOverlay.querySelector("#text").innerHTML = "playing album..";

        let album = albums.find(a => a.name == selectAlbum.value);


        let i = 0;
        let id = setInterval(function () {
            if (i < album.slides.length) {
                slideList.children[i].click();
                playOverlay.querySelector("#text").innerHTML = "showing slide" + (i + 1);
                i++;

            } else if (i == album.slides.length) {
                clearInterval(id);
                playOverlay.style.display = "none";
            }

        }, 1000);
    }
    function handleNewSlideClick() {
        overlay.style.display = "none";
        contentDetailOverlay.style.display = "none";
        createSlide.style.display = "block";
        showSlide.style.display = "none";

        slideImgUrl.value = "";
        slideTitle.value = "";
        slideTextarea.value = "";

        saveBtn.setAttribute("purpose", "create");

    }
    function handleSaveSlide() {
        let url = slideImgUrl.value;
        let title = slideTitle.value;
        let desc = slideTextarea.value;
        if (this.getAttribute("purpose") == "create") {
            let optionTemplate = template.content.querySelector(".slides");
            let slide = document.importNode(optionTemplate, true);

            slide.querySelector(".title").innerHTML = title;
            slide.querySelector(".desc").innerHTML = desc;
            slide.querySelector("img").setAttribute("src", url);

            slide.addEventListener("click", handleSlideClick);

            slideList.appendChild(slide);

            let album = albums.find(a => a.name == selectAlbum.value);
            album.slides.push({
                title: title,
                url: url,
                desc: desc
            });
            slide.dispatchEvent(new Event("click"));

        } else {
            let album = albums.find(a => a.name == selectAlbum.value);
            let slideToUpdate = album.slides.find(s => s.selected == true);

            let slideDivToBeUpdated;
            for (let i = 0; i < slideList.children.length; i++) {
                let slideDiv = slideList.children[i];
                if (slideDiv.querySelector(".title").innerHTML == slideToUpdate.title) {
                    slideDivToBeUpdated = slideDiv;
                    break;
                }
            }
            slideDivToBeUpdated.querySelector(".title").innerHTML = title;
            slideDivToBeUpdated.querySelector(".desc").innerHTML = desc;
            slideDivToBeUpdated.querySelector("img").setAttribute("src", url);

            slideToUpdate.url = url;
            slideToUpdate.title = title;
            slideToUpdate.desc = desc;



            slideDivToBeUpdated.dispatchEvent(new Event("click"));
        }
    }
    function handleSlideClick() {
        showSlide.style.display = "block";
        overlay.style.display = "none";
        contentDetailOverlay.style.display = "none";
        createSlide.style.display = "none";

        showSlide.innerHTML = "";
        let slideInViewTemplate = template.content.querySelector(".slides-in-view");
        let slideInView = document.importNode(slideInViewTemplate, true);

        slideInView.querySelector(".title").innerHTML = this.querySelector(".title").innerHTML;
        slideInView.querySelector(".desc").innerHTML = this.querySelector(".desc").innerHTML;
        slideInView.querySelector("img").setAttribute("src", this.querySelector("img").getAttribute("src"));
        slideInView.querySelector("[purpose='edit']").addEventListener("click", handleEditSlideClick);
        slideInView.querySelector("[purpose='delete']").addEventListener("click", handleDeleteSlideClick);

        showSlide.appendChild(slideInView);

        let album = albums.find(a => a.name == selectAlbum.value);
        for (let i = 0; i < album.slides.length; i++) {
            if (album.slides[i].title == this.querySelector(".title").innerHTML) {
                album.slides[i].selected = true;
            } else {
                album.slides[i].selected = false;
            }
        }



    }
    function handleEditSlideClick() {
        overlay.style.display = "none";
        contentDetailOverlay.style.display = "none";
        createSlide.style.display = "block";
        showSlide.style.display = "none";


        let album = albums.find(a => a.name == selectAlbum.value);
        let slide = album.slides.find(s => s.selected == true);


        slideImgUrl.value = slide.url;
        slideTitle.value = slide.title;
        slideTextarea.value = slide.desc;
    }
    function handleDeleteSlideClick() {

        let album = albums.find(a => a.name == selectAlbum.value);
        let sidx = album.slides.findIndex(s => s.selected == true);

        let slidedivTBD;
        for (let i = 0; i < slideList.children.length; i++) {
            let slideDiv = slideList.children[i];
            if (slideDiv.querySelector(".title").innerHTML == album.slides[sidx].title) {
                slidedivTBD = slideDiv;
                break;
            }
        }
        slideList.removeChild(slidedivTBD);
        album.slides.splice(sidx, 1);

        overlay.style.display = "none";
        contentDetailOverlay.style.display = "block";
        createSlide.style.display = "none";
        showSlide.style.display = "none";

        saveBtn.setAttribute("purpose", "update");

    }

    function saveToLocalStorage() {
        let json = JSON.stringify(albums);
        localStorage.setItem("data", json);
    }

    function loadFromLocalStorage() {
        let json = localStorage.getItem("data");
        if (!json) {
            return;
        }
        albums = JSON.parse(json);
        for (let i = 0; i < albums.length; i++) {

            let optionTemplate = template.content.querySelector("[purpose='new-album']");
            let newSlideOption = document.importNode(optionTemplate, true);

            newSlideOption.setAttribute("value", albums[i].name);
            newSlideOption.innerHTML = albums[i].name;
            selectAlbum.appendChild(newSlideOption);
        }
        selectAlbum.value = "-1";

    }
    loadFromLocalStorage();
})();