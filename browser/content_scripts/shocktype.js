const arm = async () => {
    let host = (await browser.storage.local.get('host')).host
    let url = `${host}/arm`
    console.log(url)
    fetch(url, {
        method: 'POST'
    })
}

const shock = async () => {
    let host = (await browser.storage.local.get('host')).host
    let url = `${host}/shock`
    console.log(url)
    fetch(url, {
        method: 'POST'
    })
}

const setUrl = (domain) => {
    console.log(domain)
    let host = domain
    browser.storage.local.set({host})
}

browser.runtime.onMessage.addListener((message) => {
    if (message.command === "seturl") {
      setUrl(message.host);
    }
});

window.addEventListener('load', () => {
    /**
     * Check and set a global guard variable.
     * If this content script is injected into the same page again,
     * it will do nothing next time.
     */
    if (window.hasRun) {
      return;
    }
    window.hasRun = true;

    console.log('Init Shocktype')

    const notificationCenterNode = document.getElementById('result');
    const config = { childList: true, subtree: true, attributes: true };

    arm();

    const notificationCenterMutationCallback = (mutationList, observer) => {
        for(let mutation of mutationList){
            if(mutation.type === 'childList' && mutation.addedNodes.length > 0){
                if(mutation.addedNodes.length > 0 & mutation.addedNodes[0].data.startsWith('failed')) shock();
            }
            if(mutation.type === 'attributes' && mutation.attributeName == 'class'){
                if(mutation.target.attributes.class.nodeValue == 'hidden') arm();
            }
        }
    }

    const observer = new MutationObserver(notificationCenterMutationCallback);
    observer.observe(notificationCenterNode, config);
})