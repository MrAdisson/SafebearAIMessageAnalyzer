let message =""

document.getElementById('textForm').addEventListener('submit', e =>{
    message = document.getElementById("textInput").value
    sendData()
    e.preventDefault();

})



function sendData () {
    // (A) GET FORM DATA
    var preData = new FormData();
    preData.append("textInput", document.getElementById("textInput").value);

    const data = new URLSearchParams();
    for (const pair of preData) {
        data.append(pair[0], pair[1]);
    }
   
    // (B) INIT FETCH POST
    fetch("/data", {
      method: "POST",
      body: data
    })
   
    // (C) RETURN SERVER RESPONSE AS TEXT
    .then((result) => {
      if (result.status != 200) { throw new Error("Bad Server Response"); }
      return result.text();
    })
   
    // (D) SERVER RESPONSE
    .then((data) => {
        
        const json = JSON.parse(data)
        console.log(json)


        json.forEach((result) => {
            
            let resultDiv = document.getElementById('result_' + result.label)
            let topicDiv = document.getElementById('topic_' + result.label)
            topicDiv.classList = 'topic'
            // resultDiv.classList = 'result'

            console.log(resultDiv)
            console.log(result.results[0].match)

            if(result.results[0].match){
                // resultDiv.innerText = "Danger"
                // resultDiv.classList.add("danger")
                topicDiv.classList.add("danger")
            }
            else if(result.results[0].match === false){
                // resultDiv.innerText = "Safe"
                // resultDiv.classList.add("safe")
                topicDiv.classList.add("safe")
            }
            else if (result.results[0].match === null){
                // resultDiv.innerText = "Warning"
                // resultDiv.classList.add("warning")
                topicDiv.classList.add("warning")
            }


        })

        let resume = document.createElement("div")
        resume.innerText = `Message : ${message} | [Danger] : `

        Array.from(document.getElementsByClassName("danger")).forEach(
            (element, index, array) => {
                resume.innerText += '' + element.innerText + ' / '
            }
        );        
        resume.innerText += ' | [Warnings] : '
        Array.from(document.getElementsByClassName("warning")).forEach(
            (element, index, array) => {
                resume.innerText += '' + element.innerText + ' / '
            }
        );     
        document.getElementById('resultList').appendChild(resume)

    })
   
    // (E) HANDLE ERRORS - OPTIONAL
    .catch((error) => { console.log(error); });
   
    // (F) PREVENT FORM SUBMIT
    return false;
  }