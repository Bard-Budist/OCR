
PDFJS.disableWorker = true;

var pdf = document.getElementById('inputFile');
pdf.onchange =async function(ev) {
    var file = document.getElementById('inputFile').files[0]
    console.log(file)
    if (file.type == "application/pdf") {
        var fileReader = new FileReader();
        fileReader.onload = function(ev) {
            console.log(ev);
            PDFJS.getDocument(fileReader.result).then(function getPdfHelloWorld(pdf) {
            pdf.getPage(1).then(function getPageHelloWorld(page) {
                renderCanvas(page);
            });
            }, function(error){
                console.log(error);
            });
        };
        fileReader.readAsArrayBuffer(file)
    } else {
        processTesseract(file);
    }
}

function processTesseract(imageData) {
    Tesseract.recognize(
        imageData,
        'spa',
        { logger: m => console.log(m) }
    ).then(({ data: { text } }) => {
        var splitedText = text.split('\n')
        console.log(splitedText)
        var products = []
        var lines = []
        for (const item of splitedText) {
            if (item.split("-").length - 1 >= 3) {
                products.push(item)
            } else {
                lines.push(item)
            }
        }
        $.ajax({
            url: 'https://us-central1-dataflow-chiper.cloudfunctions.net/saveOcrData',
            type: 'post',
            data: {
                products: products,
                lines: lines
            },
            headers: {
                "Access-Control-Allow-Origin": "*",
            },
            dataType: 'json',
            success: function (data) {
                console.info(data);
            }
        });
        var btn = document.createElement("p");   // Create a <button> element
        btn.innerHTML = "Se envio correctamente";   
        btn.className = "text-susess";       // Insert text
        document.body.appendChild(btn);   
      })
}

function renderCanvas(page) {
    var scale = 1.5;
    var viewport = page.getViewport(scale);
    var canvas = document.getElementById('the-canvas');
    var context = canvas.getContext('2d');

    canvas.height = viewport.height;
    canvas.width = viewport.width;
    var task = page.render({canvasContext: context, viewport: viewport})
    task.promise.then(function(){
        console.log("Data iamge")
        console.log(canvas.toDataURL('image/jpeg'));
        processTesseract(canvas.toDataURL('image/jpeg'))
    });
}