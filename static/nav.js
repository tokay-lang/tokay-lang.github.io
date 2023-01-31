let currentHeading = null;

function highlightNav() {
    let h = document.querySelectorAll("h1,h2,h3,h4,h5,h6");
    let elementArr = [];

    h.forEach(item => {
        if (item.id !== "") {
            elementArr[item.id] = item.getBoundingClientRect().top;
        }
    });

    elementArr.sort();

    for (let key in elementArr) {
        if (!elementArr.hasOwnProperty(key)) {
            continue;
        }

        if (currentHeading === null || elementArr[key] > 0 && elementArr[key] < 300) {
            if (currentHeading !== key) {
                let pathname = location.pathname;

                document.querySelectorAll(".toc a").forEach((item) => {
                    item.classList.remove("active");
                });
                document.querySelector(".toc a[href$='" + pathname + "/#" + key + "']").classList.add("active");

                currentHeading = key;
            }
            break;
        }
    }
}

window.addEventListener("scroll", highlightNav);
window.addEventListener("load", highlightNav);
