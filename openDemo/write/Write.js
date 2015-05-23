//Capturar possibles errors
process.on('uncaughtException', function(err) {
  	console.log(err);
});
//Importar mòdul net
var net = require('net')
//Port d'escolta del servidor
var port = 8000;
//Crear servidor TCP
net.createServer(function(socket){   
    socket.on('data', function(data){
	//Parse dades JSON
	var json=JSON.parse(data);			
	//Importar mòdul theThingsCoAP	
	var theThingsCoAP = require('../../');
	//Crear client theThingsCoAP
	var client = theThingsCoAP.createClient();
	//Format dades a enviar
	var object = {"values":[{
			       	"key": json.key,
			       	"value": json.value,
			       	"units": json.units,
				"type": "temporal"                
			    	}]
		      }			
	//Enviar les dades a la plataforma thethings.iO	
	client.thingWrite(object, function (error, data) {				
		if (typeof data!=='undefined' && data!==null){	
			//Resposta al client amb l'estat de la petició (success o error)				
			socket.write(data.status);		
		}							
	});						 		      
    });
//Configuració del port en el servidor TCP
}).listen(port);



