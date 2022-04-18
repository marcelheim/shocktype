const shock = async () => {
    let host = await browser.storage.sync.get('host')
    fetch(host.host)
}

window.addEventListener('load', () => {
    const notificationCenterNode = document.getElementById('result');
    const config = { childList: true, subtree: true };

    const notificationCenterMutationCallback = (mutationList, observer) => {
        for(let mutation of mutationList){
            if(mutation.type === 'childList' && mutation.addedNodes.length > 0){
                if(mutation.addedNodes.length > 0 & mutation.addedNodes[0].data == 'failed (difficulty)') shock();
            }
        }
    }

    const observer = new MutationObserver(notificationCenterMutationCallback);
    observer.observe(notificationCenterNode, config);
})