const arm = async () => {
    console.log('armed')
    fetch('http://192.168.1.131/arm', {
        method: 'POST'
    })
}

const shock = async () => {
    //let host = await browser.storage.sync.get('host')
    fetch('http://192.168.1.131/shock', {
        method: 'POST'
    })
}

window.addEventListener('load', () => {
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