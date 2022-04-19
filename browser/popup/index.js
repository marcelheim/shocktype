function seturl(tabs, host){
    browser.tabs.sendMessage(tabs[0].id, {
        command: "seturl",
        host: host
    });
}

document.addEventListener("click", (e) => {
    e.preventDefault();
    if(e.target.id == 'submitButton'){
        const hostInput = document.getElementById('hostInput');
        browser.tabs.query({active: true, currentWindow: true})
            .then(x => seturl(x, hostInput.value))
        
    }
});