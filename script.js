console.log('***************content script******************')
replaceWord();

function replaceWord() {
    var allElements = document.querySelectorAll('h1, h2, h3, h4, h5, p, a, caption, span, td');
    var titles = document.querySelectorAll('a,h2');
    var headlines = [];
    for (var i = 0; i < titles.length; i++) {
        headlines.push(titles[i].innerText);
    }

    console.log('Afther Map');
    for (var i = 0; i < titles.length; i++) {
        text = titles[i].innerText;

        if (text.length > 40) {
            console.log(text, text.length);
            let request = new XMLHttpRequest();
            url = "http://127.0.0.1:5000/json/predict?title=" + text;
            request.open("GET", url);
            request.send(text);
            request.onload = () => {
                // console.log(request);
                if (request.status === 200) {
                    // console.log("Success", request.responseText, request.responseText[0].substring(1), request.responseText[0] == '0');
                    var jsonParsedArray = JSON.parse(request.responseText);
                    prediction = jsonParsedArray['prediction'];
                    prediction_text = prediction == 1 ? "Clickbait" : "Legit";
                    title = jsonParsedArray['title'];
                    explanation = jsonParsedArray['explanation'];
                    console.log("-----------------------------------------------------------")
                    console.log("prediction : ", prediction_text, " \nTitle : ", title, "\nexplanation : ", explanation);
                    // console.log("explanation", explanation );
                    console.log("-----------------------------------------------------------")
                    if ((prediction == 1)) //clickbait
                    {
                        // console.log("Success", request.responseText, "title", title);
                        var index = headlines.indexOf(title);
                        if (index > -1) {
                            titles[index].style.color = 'transparent';
                            titles[index].style.textShadow = '0 0 8px rgba(0,0,0,0.5)';
                            titles[index].style.filter = "blur(3px)";
                        }

                    }

                } else {
                    console.log(`error ${request.status}${request.statusText}`);
                }
            }

        }
    }

}

function replaceWord_basic_response() {
    var allElements = document.querySelectorAll('h1, h2, h3, h4, h5, p, a, caption, span, td');
    var titles = document.querySelectorAll('a,h2');
    var headlines = [];
    for (var i = 0; i < titles.length; i++) {
        headlines.push(titles[i].innerText);
    }

    console.log('Afther Map');
    for (var i = 0; i < titles.length; i++) {
        text = titles[i].innerText;
        if (text.length > 40) {
            console.log(text, text.length);
            let request = new XMLHttpRequest();
            url = "http://127.0.0.1:5000/predict?title=" + text;
            request.open("GET", url);
            request.send();
            request.onload = () => {
                console.log(request);
                if (request.status === 200) {
                    console.log("Success", request.responseText, request.responseText[0].substring(1), request.responseText[0] == '0');

                    if ((request.responseText[0] == '0')) //clickbait
                    {
                        // console.log("Success", request.responseText, "title", request.responseText.substring(1), request.responseText[0] == '0');
                        console.log("title", request.responseText.substring(1), "is", headlines.indexOf(request.responseText.substring(1)));
                        var index = headlines.indexOf(request.responseText.substring(1));
                        if (index > -1) {
                            titles[index].style.color = 'transparent';
                            titles[index].style.textShadow = '0 0 8px rgba(0,0,0,0.5)';
                            titles[index].style.filter = "blur(3px)";
                        }

                    }

                } else {
                    console.log(`error ${request.status}${request.statusText}`);
                }
            }

        }
    }

}

// post_at_once()

function post_at_once() {
    var titles = document.querySelectorAll('a');
    var headlines = [];
    for (var i = 0; i < titles.length; i++) {
        headlines.push(titles[i].innerText);
    }
    doPost(headlines, titles);
}

function doPost(list, html_identifiers) {
    url = "http://127.0.0.1:5000/post";
    var http = new XMLHttpRequest();
    http.open("POST", url, true);
    http.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById("content").innerHTML = this.responseText;
        }
    };
    var params = {
        "Titles": [
            list
        ],
    }

    http.send(JSON.stringify(params))
    http.onload = () => {
        console.log("Sa vedem Raspuns")
        console.log(http.responseText);

        var jsonParsedArray = JSON.parse(http.responseText);
        predictionList = jsonParsedArray['response'];
        console.log("predictionList", predictionList);

        for (var i = 0; i < predictionList.length; i++) {

            prediction = predictionList[i][0]
            title = predictionList[i][1]
            explanation = predictionList[i][2]
            console.log("prediction", prediction, "title", title, "explanation", explanation);

            if (prediction == 1) {
                var index = list.indexOf(title);
                if (index > -1) {
                    html_identifiers[index].style.color = 'transparent';
                    html_identifiers[index].style.textShadow = '0 0 8px rgba(0,0,0,0.5)';
                    html_identifiers[index].style.filter = "blur(3px)";
                }
            }
        }
    }
}