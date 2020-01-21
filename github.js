(function () {  // working in local namespace
    // the function that triggers an Ajax call
    function getData() {
        var userInput = document.getElementById("userInput").value.trim();
        if (userInput === "") //if the input is empty exception throw
        {
            var temp = document.getElementById('alertId2');
            temp.style.display = "block";
            setTimeout(function () {
                temp.style.display = 'none';
            }, 5000);
            return;
        }


        // fetch to the user git hub api
        fetch('https://api.github.com/users/' + userInput)
            .then(
                function (response) {
                    document.getElementById("table").style.display = "block";
                    document.getElementById("table2").style.display = "block";
                    // handle the error
                    if (response.status !== 200) {
                        var temp = document.getElementById('alertId3');
                        temp.style.display = "block";
                        setTimeout(function () {
                            temp.style.display = 'none';
                        }, 5000);
                        return;
                    }

                    // Examine the response and generate the HTML
                    response.json().then(function (data) {
                        var html = "<h2 class='alert alert-primary'>" + data.login + "</h2>";
                        document.querySelector("#data").innerHTML = html;
                    });
                }
            )
            .catch(function (err) {
                console.log('Fetch Error :', err);
            });


        // fetch to the user's followers git hub api
        fetch('https://api.github.com/users/' + userInput + '/followers')
            .then(
                function (response) {

                    // handle the error
                    if (response.status !== 200) {
                        return;
                    }

                    // Examine the response and generate the HTML
                    response.json().then(function (data) {
                        var html = "<h2>Followers </h2>";
                        document.querySelector("#follow").innerHTML = html;

                        if (data.length === 0) {
                            var temp = document.getElementById('alertId5');
                            temp.style.display = "block";
                            setTimeout(function () {
                                temp.style.display = 'none';
                            }, 5000);
                        }
                        var newElement;
                        for (var i = 0; i < data.length; i++) {
                            newElement = document.createElement("a");
                            newElement.innerHTML += "<li>" + data[i].login;
                            newElement.href = 'https://github.com/' + data[i].login;
                            document.getElementById("follow").appendChild(newElement);
                        }
                    });
                }
            )
            .catch(function (err) {
                console.log('Fetch Error :', err);
            });

        // fetch to the user's repos git hub api
        fetch('https://api.github.com/users/' + userInput + '/repos')
            .then(
                function (response) {

                    if (response.status !== 200) {
                        // document.querySelector("#repos").innerHTML = 'Looks like there was a problem. Status Code: ' +
                        //         response.status;
                        return;
                    }

                    // Examine the response and generate the HTML
                    response.json().then(function (data) {
                        var html = "<h2>Repositories </h2>";
                        document.querySelector("#repos").innerHTML = html;
                        if (data.length === 0) {
                            var temp = document.getElementById('alertId4');
                            temp.style.display = "block";
                            setTimeout(function () {
                                temp.style.display = 'none';
                            }, 5000);
                        }

                        var newElement;
                        for (var i = 0; i < data.length; i++) {
                            newElement = document.createElement("a");
                            newElement.innerHTML += "<li>" + data[i].full_name;
                            newElement.href = 'https://github.com/' + data[i].full_name;
                            document.getElementById("repos").appendChild(newElement);
                        }


                    });
                }
            )
            .catch(function (err) {
                console.log('Fetch Error :', err);
            });
    };

    // the function send to the server the user input and ask for saving the user
    // in the global list that the server contains
    async function save() {

        var userInput = document.getElementById("userInput").value.trim();
        fetch('https://api.github.com/users/' + userInput)
            .then(
                function (response) {
                    // handle the error
                    if (response.status !== 200) {
                        var temp = document.getElementById('alertId6');
                        temp.style.display = "block";
                        setTimeout(function () {
                            temp.style.display = 'none';
                        }, 5000);
                        return;
                    }
                    response.json().then(async function (data) {
                        if (data.login === null) {
                            var temp = document.getElementById('alertId6');
                            temp.style.display = "block";
                            setTimeout(function () {
                                temp.style.display = 'none';
                            }, 5000);
                            return;
                        } else {
                            var userName = document.getElementById("userInput").value.trim();
                            const url = '/save';
                            const data = {userName: userName};
                            try {
                                const response = await fetch(url, {
                                    method: 'POST',
                                    body: JSON.stringify(data), // data can be `string` or {object}!
                                    headers: {'Content-Type': 'application/json'}
                                });

                                const json = await response.json();
                                var child = document.getElementById("userHolder").children;
                                if (child.length === json.length) {
                                    var temp = document.getElementById('alertId');
                                    temp.style.display = "block";
                                    setTimeout(function () {
                                        temp.style.display = 'none';
                                    }, 3000);
                                }
                                var html = "";
                                document.querySelector("#userHolder").innerHTML = html;
                                for (var i in json) {
                                    var newElement = document.createElement("a");
                                    newElement.innerHTML = "<li>" + json[i].login + "</li>";
                                    newElement.href = 'https://github.com/' + json[i].login;
                                    document.getElementById("userHolder").appendChild(newElement);
                                }

                            } catch (error) {
                                console.error('Error:', error);
                            }
                        }

                    });
                }
            )
            .catch(function (err) {
                console.log('Fetch Error :', err);
                return flag;
            });
    }

    // the function send to the server the user input and ask for deleting the user
    // in the global list that the server contains
    async function del() {
        var userName = document.getElementById("userInput").value.trim();
        const url = '/delete';
        const data = {userName: userName};
        try {
            const response = await fetch(url, {
                method: 'POST',
                body: JSON.stringify(data), // data can be `string` or {object}!
                headers: {'Content-Type': 'application/json'}
            });

            const json = await response.json();

            var html = "";
            document.querySelector("#userHolder").innerHTML = html;
            for (var i in json) {
                var newElement = document.createElement("a");
                newElement.innerHTML = "<li>" + json[i].login + "</li>";
                newElement.href = 'https://github.com/' + json[i].login;
                document.getElementById("userHolder").appendChild(newElement);
            }

        } catch (error) {
            console.error('Error:', error);
        }
    }


    document.addEventListener('DOMContentLoaded', function () {
        document.querySelector("#getdata").addEventListener("click", getData);
        document.querySelector("#saveButton").addEventListener("click", save);
        document.querySelector("#deleteButton").addEventListener("click", del);
    }, false);

    document.addEventListener('DOMContentLoaded', async function () {
        document.getElementById("table").style.display = "block";
        document.getElementById("table2").style.display = "block";
        const url = '/';
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'}
            });
            const json = await response.json();
            //show saved list
            document.querySelector("#userHolder").innerHTML = "";
            for (var i in json) {
                var newElement = document.createElement("a");
                newElement.innerHTML = "<li>" + json[i].login + "</li>";
                newElement.href = 'https://github.com/' + json[i].login;
                document.getElementById("userHolder").appendChild(newElement);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }, false);

})();
