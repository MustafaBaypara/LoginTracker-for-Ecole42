let monthlyTime = {};
let userProfile = {};

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "loginTime") {
        monthlyTime = message.data; 
        sendResponse({ type: "loginTime", data: monthlyTime }); 
    } else if (message.type === "userProfile") {
        userProfile = message.data; 
        sendResponse({ type: "userProfile", data: userProfile }); 
    }
});

chrome.runtime.onConnect.addListener(port => {
    if (port.name === "popup") {
        port.onMessage.addListener(msg => {
            if (msg.type === "loginTime") {
                port.postMessage({ type: "loginTime", data: monthlyTime }); 
            } else if (msg.type === "userProfile") {
                port.postMessage({ type: "userProfile", data: userProfile }); 
            }
        });
    }
});
