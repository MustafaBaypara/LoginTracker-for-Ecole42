const observer = new MutationObserver(() => {
    const userElement = document.getElementsByClassName('login')[0];
    if (userElement) {
        let dataLogin = userElement.getAttribute('data-login');
			
        if (dataLogin) {
            chrome.runtime.sendMessage({
                type: "userProfile",
                data: {
                    login: dataLogin,
                }
            });
        }
    }

    const elements = document.getElementById("user-locations");
    if (elements) {
        const childElements = elements.children;

        let monthlyTime = {};
        let currentMonth = '';
        let totalHours = 0;
        let totalMinutes = 0;
        let activeDays = 0;

        Array.from(childElements).forEach(element => {
            if (element.tagName === 'text') {
                if (currentMonth) {
                    totalHours += Math.floor(totalMinutes / 60);
                    totalMinutes = totalMinutes % 60;

                    if (totalHours > 0 || totalMinutes > 0) {
                        monthlyTime[currentMonth] = {
                            hours: totalHours,
                            minutes: totalMinutes,
                            activeDays: activeDays
                        };
                    }
                    totalHours = 0;
                    totalMinutes = 0;
                    activeDays = 0;
                }
                currentMonth = element.textContent;
            } else if (element.tagName === 'g') {
                const title = element.getAttribute('data-original-title');
                const match = title.match(/(\d+)h(?:\s*(\d+))?/);

                if (match) {
                    const hours = parseInt(match[1], 10);
                    const minutes = match[2] ? parseInt(match[2], 10) : 0;

                    totalHours += hours;
                    totalMinutes += minutes;

                    if (hours > 0 || minutes > 0) {
                        activeDays += 1;
                    }
                }
            }
        });

        if (currentMonth) {
            totalHours += Math.floor(totalMinutes / 60);
            totalMinutes = totalMinutes % 60;

            if (totalHours > 0 || totalMinutes > 0) {
                monthlyTime[currentMonth] = {
                    hours: totalHours,
                    minutes: totalMinutes,
                    activeDays: activeDays
                };
            }
        }

        chrome.runtime.sendMessage({ type: "loginTime", data: monthlyTime });
    }
});

observer.observe(document.body, { childList: true, subtree: true });
