javascript: 
/*Adatok: jelentés azon;célpont koord;jelentés SZÍNe;volt e checkbox-olt jeli;régi jeli e? (igen->nincs nyerselem)*/
var nyersossz=0;

if (/*VIJE_REF2.*/document.getElementById("attack_spy_resources")){
	var x=/*VIJE_REF2.*/document.getElementById("attack_spy_resources").rows[0].cells[1];
	/*if (adatok[4]) {var nyersossz="";debug("VIJE2","Nem kell elemezni (régi)"); } else {
		try{var nyers=x.textContent.replace(/\./g,"").match(/[0-9]+/g);
		var nyersossz=0;
		for (var i=0;i<nyers.length;i++) nyersossz+=parseInt(nyers[i],10);}catch(e){var nyersossz=0;}
	}*/

if (/*VIJE_REF2.*/document.getElementById("attack_spy_buildings_left")){
		var s=document.getElementById("vije").getElementsByTagName("input");
		var nevek=new Array(s[0].value.toUpperCase(),s[1].value.toUpperCase(),s[2].value.toUpperCase(),s[3].value.toUpperCase());
		var banyak=new Array(0,0,0); var fal=0;
		
		var s=/*VIJE_REF2.*/document.getElementById("attack_spy_buildings_left").rows;
		for (var i=1;i<s.length;i++){
			for (var j=0;j<3;j++){if (s[i].cells[0].textContent.toUpperCase().indexOf(nevek[j])>-1) banyak[j]=s[i].cells[1].textContent;}
			if (s[i].cells[0].textContent.toUpperCase().indexOf(nevek[3])>-1) fal=s[i].cells[1].textContent;
		}
		var s=/*VIJE_REF2.*/document.getElementById("attack_spy_buildings_right").rows;
		for (var i=1;i<s.length;i++){
			for (var j=0;j<3;j++){if (s[i].cells[0].textContent.toUpperCase().indexOf(nevek[j])>-1) banyak[j]=s[i].cells[1].textContent;}
			if (s[i].cells[0].textContent.toUpperCase().indexOf(nevek[3])>-1) fal=s[i].cells[1].textContent;
		}
	} else { /*Csak nyerset láttunk*/
		var banyak="";
		var fal="";
	}
	/*VIJE_adatbeir(adatok[1],nyersossz,banyak,fal,adatok[2]);*/
	alert(nyersossz,banyak,fal);
} else {
	alert("NEM ELEMZEM");
	/*VIJE_adatbeir(adatok[1],0,"","",adatok[2]);*/
	/*Nincs elemzendo adat :(*/
}

/*Tedd be az elemzettek listájába az ID-t*/
document.getElementById("VIJE_elemzett").innerHTML+=adatok[0]+",";
if (document.getElementById("VIJE_elemzett").innerHTML.split(",").length>200){
	document.getElementById("VIJE_elemzett").innerHTML=document.getElementById("VIJE_elemzett").innerHTML.split(",").splice(100,100)+",";
}
void(0);