//Capturar possibles errors
process.on('uncaughtException', function(err) {
  	console.log(err);
});
//Importar mòdul net
var net = require('net')
//Port d'escolta del servidor
var port = 8002;
//Crear servidor TCP
net.createServer(function(socket){   
    socket.on('data', function(data){
	//Parse dades JSON	
	var json=JSON.parse(data);
	//Importar mòdul theThingsCoAP	
	var theThingsCoAP = require('../../')
	//Crear client theThingsCoAP
	var client = theThingsCoAP.createClient()
	client.on('ready', function () {
    		read(json.endDate)
	})
	//Funció per llegir dades de la plataforma thethings.iO
	function read(endDate){
	client.thingRead(json.key, {limit: 100,endDate: endDate, startDate: json.startDate}, function (error, data) {        	
		if (typeof data!=='undefined' && data!==null){				
			if (data.length > 0) {
				var dataSend=""
				var coma=","
				for (var i=0;i<=(data.length - 1);i++){
					dataSend=dataSend+data[i].value+coma+data[i].datetime.split('T')[1]+coma
				}				
				socket.write(dataSend); 				
            			read(data[data.length - 1].datetime.split('.')[0].replace(/-/g, '').replace(/:/g, '').replace('T', ''))
        		}else{
				socket.write("</FINAL>");				
			}
		}	
    	})
	}
	    
  	  });
//Configuració del port en el servidor TCP
}).listen(port);



