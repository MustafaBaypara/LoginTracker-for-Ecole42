document.addEventListener('DOMContentLoaded', function() {
    let port = chrome.runtime.connect({ name: "popup" });

    function updateData() {
        port.postMessage({ type: "loginTime" });
        port.postMessage({ type: "userProfile" });

        port.onMessage.addListener(msg => {
            if (msg.type === "loginTime") {
                const monthlyTime = msg.data;
                console.log('Monthly Time:', monthlyTime);

                const dataBody = document.getElementById('data-body');
                const totalHoursElem = document.getElementById('total-hours');
                const totalMinutesElem = document.getElementById('total-minutes');
                const totalActiveDaysElem = document.getElementById('total-active-days');

                let totalHours = 0;
                let totalMinutes = 0;
                let totalActiveDays = 0;

                dataBody.innerHTML = '';

                Object.keys(monthlyTime).forEach(month => {
                    const { hours, minutes, activeDays } = monthlyTime[month];

                    totalHours += hours;
                    totalMinutes += minutes;
                    totalActiveDays += activeDays;

                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${month}</td>
                        <td>${hours}</td>
                        <td>${minutes}</td>
                        <td>${activeDays}</td>
                    `;
                    dataBody.appendChild(row);
                });

                totalHours += Math.floor(totalMinutes / 60);
                totalMinutes = totalMinutes % 60;

                if (totalHours === 0 || totalMinutes === 0 || totalActiveDays === 0) {
                    totalHours = "refresh";
                    totalMinutes = "in";
                    totalActiveDays = "intra";
                }

                totalHoursElem.textContent = totalHours;
                totalMinutesElem.textContent = totalMinutes;
                totalActiveDaysElem.textContent = totalActiveDays;
            }

            if (msg.type === "userProfile") {
                const userProfile = msg.data;
                const userElem = document.getElementById('user');

				if (userProfile.login) {
					userElem.innerHTML = `
                    <span>${userProfile.login}</span>
                `;
				}
				else {
					userElem.innerHTML = `
                    <span>maybe refresh in intra</span>
                `;
				}
                
            }
        });
    }

    updateData();
});
