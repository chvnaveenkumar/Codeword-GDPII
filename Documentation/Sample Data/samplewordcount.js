Excel.run(function (context) {
    var code = context.codewordset.length;
    code.load("These are number of codewords");

    return context.sync()
        .then(function () {
            if (code.items.length > 1) {
                console.log(`There are ${code.items.length} in codeword set`);
            } else {
                console.log(`No codewords`);
            }
            for (var i in code.items) {
                console.log(code.items[i].name);
            }
        });
}).catch(errorHandlerFunction);