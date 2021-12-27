const fs = require('fs');
var jsonInicial = 'broken-database.json'; saidaJson = 'saida.json'; 
                        /**1-Recuperação dos dados originais do banco de dados*/
                                    /**A)Ler o arquivo Json */
function objJson(path) { 
    return JSON.parse(fs.readFileSync(path)); 
}
                                   /**B)Corrigir nomes */
function subsName(data) {
    for(var i = 0; i < data.length; i++) {
        data[i].name = data[i].name.split('æ').join('a').split('ß').join('b').split('¢').join('c').split('ø').join('o');
    }
}
                                 /**C)Corrigir preços */
function numberPrice(data) {
    for(var i = 0; i < data.length; i++) { 
        if(typeof(data[i].price) != 'number') {
            data[i].price = parseFloat(data[i].price);
        }
    }
}
                                /**D)Corrigir quantidades */
function insereQuantity(data) {
    for(var i = 0; i < data.length; i++) {
        if(!data[i].hasOwnProperty('quantity')) {
            data[i].quantity = 0;
        }
    }
}
                   /**E)Exportar um arquivo JSON com o banco corrigido */
function exportarJson(data, novoArquivo) {
    var json = JSON.stringify(data, null, 2); 
    fs.writeFileSync(novoArquivo, json);

}

var guardandoDados = objJson(jsonInicial); 
if(guardandoDados != 0) {
    subsName(guardandoDados);
    numberPrice(guardandoDados);
    insereQuantity(guardandoDados);
    exportarJson(guardandoDados, saidaJson);
}
                                     /**2- Validação do banco de dados corrigido  */
                                     /**ordenando em categoria, em seguida por id */ 
/**a) Uma função que imprime a lista com todos os nomes dos produtos, ordenados primeiro por categoria em ordem 
alfabética e ordenados por id em ordem crescente. Obs: é apenas uma saída, ordenada pelos dois fatores citados acima.*/
function ordenando(data) {
    data.sort((a, b) => {
        a = a.category.toLowerCase();
        b = b.category.toLowerCase();
        return (a < b) ? -1 : (a > b) ? 1 : 0;
    });
    data.sort((a, b) => {
        if(a.category == b.category) {
            a = a.id;
            b = b.id;
            return (a < b) ? -1 : (a > b) ? 1 : 0; 
        }
    })
    for(var i = 0; i < data.length; i++) {
        console.log(data[i].id,'-',data[i].category,'-',data[i].name);
    }
}
                                     /**total de estoque por categoria */
/**b) Uma função que calcula qual é o valor total do estoque por categoria, ou seja, a soma do valor de todos os produtos
em estoque de cada categoria, considerando a quantidade de cada produto. */
function qtdCategoria(data) {
    var quantityTotal = [], total= -1;var guardandoCategory = ''; 
    for (var i = 0; i < data.length; i++) {
        if(guardandoCategory != data[i].category) {
            quantityTotal.push({'category': data[i].category,'quantity': 0,})
            total++;
        }
        quantityTotal[total].quantity += data[i].quantity; 
        guardandoCategory = data[i].category; 
    }

    return quantityTotal;
}
var dadosRestaurados = objJson(saidaJson);
if(dadosRestaurados != 0) {
    ordenando(dadosRestaurados);
    console.log('Total de estoque de cada categoria: ',qtdCategoria(dadosRestaurados));
}