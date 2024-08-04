javascript:
if (typeof(AZON)=="undefined") {alert("Ez a script SZEM4 keretrendszer�be �p�l bele. El�sz�r futtasd SZEM4-et!"); exit();}
/*-----------------�P�T�--------------------*/
function szem4_EPITO_perccsokkento(){try{
	var hely=document.getElementById("epit").getElementsByTagName("table")[1].rows;
	var patt=/[0-9]+( perc)/g; var sz=0;
	for (var i=1;i<hely.length;i++){
		if (hely[i].cells[3].textContent.search(patt)>-1){
			sz=hely[i].cells[3].textContent.match(/[0-9]+/g)[0];
			if (sz=="0") continue;
			sz=parseInt(sz,10); 
			sz--;
			if (sz>0){
				sz=sz+"";
				if (sz.length==1) sz="000"+sz;
				if (sz.length==2) sz="00"+sz;
				if (sz.length==3) sz="0"+sz;
			}
			hely[i].cells[3].innerHTML=hely[i].cells[3].innerHTML.replace(/[0-9]+/,sz);
		}
	}
}catch(e){debug("�p�t�_pcs�kk",e);}
	setTimeout("szem4_EPITO_perccsokkento()",60000);
	return;
}

function szem4_EPITO_getlista(){try{
	var ret='<select>';
	var Z=document.getElementById("epit").getElementsByTagName("table")[0].rows;
	for (var i=1;i<Z.length;i++){
		ret+='<option value="'+Z[i].cells[0].textContent+'">'+Z[i].cells[0].textContent+'</option> ';
	}
	ret+='</select>'; 
	return ret;
}catch(e){debug("�p�t�",e);}}

function szem4_EPITO_csopDelete(ezt){try{
	var name=ezt.innerHTML;
	if (!confirm("Biztos kit�rl�d a "+name+" nev� csoportot?\nA csoportot haszn�l� faluk az Alap�rtelmezett csoportba fognak tartozni.")) return;
	sortorol(ezt,"");
	var bodyTable=document.getElementById("epit_lista").rows;
	for (var i=1;i<bodyTable.length;i++){
		var selectedElement=bodyTable[i].cells[1].getElementsByTagName("select")[0];
		if (selectedElement.value==name) selectedElement.value=document.getElementById("epit").getElementsByTagName("table")[0].rows[1].cells[0].innerHTML;
	}
	bodyTable=document.getElementById("epit_ujfalu_adat").getElementsByTagName("option");
	for (var i=0;i<bodyTable.length;i++){
		if (bodyTable[i].value==name){document.getElementById("epit_ujfalu_adat").getElementsByTagName("select")[0].remove(i); break;}
	}
}catch(e){alert2("Hiba:\n"+e);}}

function szem4_EPITO_ujFalu(){try{
	var adat=document.getElementById("epit_ujfalu_adat");
	var f_nev=adat.getElementsByTagName("input")[0].value;
	if (f_nev=="" || f_nev==null) return;
	f_nev=f_nev.match(/[0-9]{1,3}(\|)[0-9]{1,3}/g);
	var Z=document.getElementById("epit_lista"); var str="";
	var lista=szem4_EPITO_getlista();
	for (var i=0;i<f_nev.length;i++){
		var vane=false;
		for (var j=1;j<Z.rows.length;j++){
			if (Z.rows[j].cells[0].textContent==f_nev[i]) vane=true;
		} if (vane) {str+="DUP:"+f_nev[i]+", "; continue;}
		if (koordTOid(f_nev[i])==0) {str+="NL: "+f_nev[i]+", "; continue;}
		
		var ZR=Z.insertRow(-1);
		var ZC=ZR.insertCell(0); ZC.innerHTML=f_nev[i]; ZC.setAttribute("ondblclick","sortorol(this)");
			ZC=ZR.insertCell(1); ZC.innerHTML=lista; ZC.getElementsByTagName("select")[0].value=adat.getElementsByTagName("select")[0].value;
			ZC=ZR.insertCell(2); ZC.style.fontSize="x-small"; var d=new Date(); ZC.innerHTML=d; ZC.setAttribute("ondblclick","szem4_EPITO_most(this)");
			ZC=ZR.insertCell(3); ZC.innerHTML="<i>Feldolgoz�s alatt...</i>"+' <a href="'+VILL1ST.replace(/(village=)[0-9]+/g,"village="+koordTOid(f_nev[i]))+'" target="_BLANK"><img alt="Nyit" title="Falu megnyit�sa" src="'+pic("link.png")+'"></a>';; ZC.setAttribute("ondblclick",'szem4_EPITO_infoCell(this.parentNode,\'alap\',"")');
	}
	if (str!="") alert2("Dupla megad�sok/nem l�tez� faluk kisz�rve: "+str);
	adat.getElementsByTagName("input")[0].value="";
	return;
}catch(e){alert2("�j falu(k) felv�telekori hiba:\n"+e);}}

function szem4_EPITO_ujCsop(){try{
	var cs_nev=document.getElementById("epit_ujcsopnev").value.replace(/[;\._]/g,"").replace(/( )+/g," ");;
	if (cs_nev=="" || cs_nev==null) return;
	var Z=document.getElementById("epit").getElementsByTagName("table")[0];
	for (var i=1;i<Z.rows.length;i++){
		if (Z.rows[i].cells[0].textContent==cs_nev) throw "M�r l�tezik ilyen nev� csoport";
	}
	var ZR=Z.insertRow(-1);
	var ZC=ZR.insertCell(0); ZC.innerHTML=cs_nev; ZC.setAttribute("ondblclick","szem4_EPITO_csopDelete(this)");
		ZC=ZR.insertCell(1); ZC.innerHTML=Z.rows[1].cells[1].innerHTML; ZC.getElementsByTagName("input")[0].disabled=false;
	
	var Z=document.getElementById("epit_lista").rows;
	for (var i=1;i<Z.length;i++){
		var Z2=Z[i].cells[1].getElementsByTagName("select")[0];
		var option=document.createElement("option");
		option.text=cs_nev;
		Z2.add(option);
	}
	Z2=document.getElementById("epit_ujfalu_adat").getElementsByTagName("select")[0];
	option=document.createElement("option");
	option.text=cs_nev;
	Z2.add(option);
	document.getElementById("epit_ujcsopnev").value="";
	return;
}catch(e){alert2("�j csoport felv�telekori hiba:\n"+e);}}

function szem4_EPITO_cscheck(alma){try{
	var Z=alma.parentNode.getElementsByTagName("input")[0].value;
	Z=Z.split(";");
	
	var epuletek=new Array("main","barracks","stable","garage","church_f","church","smith","snob","place","statue","market","wood","stone","iron","farm","storage","hide","wall","MINES");
	for (var i=0;i<Z.length;i++){
		if (epuletek.indexOf(Z[i].match(/[a-zA-Z]+/g)[0])>-1) {} else throw "Nincs ilyen �p�let: "+Z[i].match(/[a-zA-Z]+/g)[0];
		if (parseInt(Z[i].match(/[0-9]+/g)[0])>30) throw "T�l magas �p�letszint: "+Z[i];
	}
	alert2("Minden OK");
}catch(e){alert2("Hib�s lista:\n"+e);}}

function szem4_EPITO_most(objektum){try{
	var d=new Date();
	objektum.innerHTML=d;
	return;
}catch(e){alert2("Hiba l�pett fel:\n"+e);}}

function szem4_EPITO_csopToList(csoport){try{
	var Z=document.getElementById("epit").getElementsByTagName("table")[0].rows;
	for (var i=1;i<Z.length;i++){
		if (Z[i].cells[0].textContent==csoport) return Z[i].cells[1].getElementsByTagName("input")[0].value;
	}
	return ";";
}catch(e){debug("epito_csopToList",e);}}

function szem4_EPITO_Wopen(){try{
	/*Eredm�ny: faluID, teljes �p�tend� lista, pointer a sorra*/
	var TT=document.getElementById("epit_lista").rows;
	var now=new Date();
	for (var i=1;i<TT.length;i++){
		var datum=new Date(TT[i].cells[2].textContent);
		if (datum<now) {
			var lista=szem4_EPITO_csopToList(TT[i].cells[1].getElementsByTagName("select")[0].value);
			return [koordTOid(TT[i].cells[0].textContent),lista,TT[i]];
		}
	}
	return [0,";"];
}catch(e){debug("Epito_Wopen",e);}}

function szem4_EPITO_addIdo(sor,ido){try{
	if (ido=="del") {
		document.getElementById("epit_lista").deleteRow(sor.rowIndex);
	} else {
		var d=new Date();
		d.setMinutes(d.getMinutes()+Math.round(ido));
		sor.cells[2].innerHTML=d;
	}
	return true;
}catch(e){debug("epito_addIdo",e); return false;}}

function szem4_EPITO_infoCell(sor,szin,info){try{
	if (szin=="alap") szin="#f4e4bc";
	if (szin=="blue") szin="#44F";
	if (szin=="red") setTimeout('playSound("kritikus_hiba")',2000);
	sor.cells[3].style.backgroundColor=szin;
	
	sor.cells[3].innerHTML=info+' <a href="'+VILL1ST.replace(/(village=)[0-9]+/g,"village="+koordTOid(sor.cells[0].textContent))+'" target="_BLANK"><img alt="Nyit" title="Falu megnyit�sa" src="'+pic("link.png")+'"></a>';
	return;
}catch(e){debug("�p�t�_infoCell",e);}}

function szem4_EPITO_getBuildLink(ref, type) {
  var row = ref.document.getElementById('main_buildrow_' + type);
  if (row.cells.length < 3) return false;
  var patt = new RegExp('main_buildlink_'+type+'_[0-9]+','g');
  var allItem = row.getElementsByTagName("*");
  for (var i=0;i<allItem.length;i++) {
    if (patt.test(allItem[i].id)) {
      return allItem[i];
    }
  }
}

function szem4_EPITO_IntettiBuild(pcel){try{
	/*Jelenleg: �p�t�s alatt �ll�k --> blista*/
	try{TamadUpdt(EPIT_REF);}catch(e){}
	try{var sor=EPIT_REF.document.getElementById("buildqueue").rows;
	
	var blista=""; /*BuildingList*/
	var bido=0; /*Ennyi perc �p�t�si id�*/
	var bido1=0; /*Az els� �p�let �p�t�si ideje*/
	var s;
	for (var i=1;i<sor.length;i++){
		try{blista+=sor[i].cells[0].getElementsByTagName("img")[0].src.match(/[A-Za-z0-9]+\.(png)/g)[0].replace(/[0-9]+/g,"").replace(".png","");
			s=sor[i].cells[1].textContent.split(":");
			bido+=parseInt(s[0])*60+parseInt(s[1])+(parseInt(s[2])/60);
			if (bido1==0) bido1=bido;
			blista+=";";
		}catch(e){}
	}
	bido=Math.round(bido);
		bido=bido+"";if (bido!="0"){
		if (bido.length==1) bido="000"+bido;
		if (bido.length==2) bido="00"+bido;
		if (bido.length==3) bido="0"+bido;}
	bido1=bido1.toFixed(2)+1;
	if (bido1>180) bido1=180;
	}catch(e){var blista=";"; var bido=0; var bido1=0;}
	
	if (blista.split(";").length>4) { szem4_EPITO_addIdo(PMEP[2],100);  return "overflow";} 
	
	/*K�vetkez� �p�let meghat�roz�sa: �p�tend� �p�let ---> str*/
	var GD=EPIT_REF.game_data.village.buildings;
	var cel=pcel.split(";");
	var jel=new Array(); /*�p�letek szintjei*/
	var ijel=new Array(); /*�p�let t�pusa*/
	
	var i=-2;
	var ss=blista.split(";");
	for (var elem in GD){
		i++; if (i==-1) continue;
		jel[i]=GD[elem];
		ijel[i]=elem;
		for (var g=0;g<ss.length;g++){
			if (ijel[i]==ss[g]) {
				jel[i]++;
				ss[g]="";}
		}
	}
	var str=""; var vizsga=""; var mine=new Array(0,0,0);
	for (i=0;i<cel.length;i++){
		vizsga=cel[i].split(" ")[0];
		for (var j=0;j<ijel.length;j++){ /*Keress�k a megfelel� �p�let jelenlegi szintj�t*/
			if (ijel[j]==vizsga) {	/*Megvan, jelenlegi szintje jel[j]*/
				/*alert("C�l: "+cel[i]+"\n Jelenleg: "+ijel[j]+" - "+jel[j]);*/
				for (var k=0;k<parseInt(cel[i].split(" ")[1])-jel[j];k++){
					str+=vizsga+";";
				}
				if (parseInt(cel[i].split(" ")[1])-jel[j]>0) jel[j]=parseInt(cel[i].split(" ")[1]);
			}
		}
		if (vizsga=="MINES"){
			/*3 indexet keresni: wood;stone;iron-�t*/
			for (var j=0;j<ijel.length;j++){
				if (ijel[j]=="wood") mine[0]=j;
				if (ijel[j]=="stone") mine[1]=j;
				if (ijel[j]=="iron") mine[2]=j;
			}
			for (var j=0;j<=parseInt(cel[i].split(" ")[1]);j++){
				for (var k=0;k<3;k++){
					if (jel[mine[k]] < j) {
						str+=k+";";
						jel[mine[k]]++;
					}
				}
			}
			str=str.replace(/0/g,"wood");
			str=str.replace(/1/g,"stone");
			str=str.replace(/2/g,"iron");
		}
		if (str!="") {
			if (str.indexOf(";")>-1) str=str.split(";")[0];
			break;
		}
	}
	if (str.length<4) {/*K�SZ, T�RL�S*/ 
		naplo("�p�t�",'<a href="'+VILL1ST.replace(/(village=)[0-9]+/g,"village="+PMEP[0])+'" target="_BLANK">'+EPIT_REF.game_data.village.name+" ("+EPIT_REF.game_data.village.x+"|"+EPIT_REF.game_data.village.y+")</a> falu teljesen fel�p�lt �s t�rl�d�tt a list�b�l");
		setTimeout('playSound("falu_kesz")',1500);
		szem4_EPITO_addIdo(PMEP[2],"del"); return;
	}
	/* �p�t�s "iself" */
	var build=str;
	var a;
	if (a=szem4_EPITO_getBuildLink(EPIT_REF,build)) {
		if (a.style.display!=='none') {
			a.click(); 
			playSound("epites");
			szem4_EPITO_addIdo(PMEP[2],1); /*Sikeres Esem�ny lejelent�se SZEM4-nek: +30mp*/
			szem4_EPITO_infoCell(PMEP[2],"alap","�p�t�s folyamatban.");
		} else {
			/*Jelenleg nem �p�thet�. Mi�rt?*/
			var elements=new Array(parseInt(EPIT_REF.document.getElementById("storage").textContent),parseInt(EPIT_REF.document.getElementById("pop_max_label").textContent)-parseInt(EPIT_REF.document.getElementById("pop_current_label").textContent)); /*rakt�r, szabad hely*/
			a=a.parentNode.parentNode.cells;
			var needs=new Array(parseInt(a[1].textContent),parseInt(a[2].textContent),parseInt(a[3].textContent),parseInt(a[5].textContent)); /*nyersek, tanya*/
			var ok="";
			if (needs[0]>elements[0] || needs[1]>elements[0] || needs[2]>elements[0]) {ok="storage";}
				else if (needs[3]>elements[1]) {ok="farm";}
			if (ok=="") {
					/*Nincs nyers?*/
					if (needs[0]>EPIT_REF.game_data.village.wood || needs[1]>EPIT_REF.game_data.village.stone || needs[2]>EPIT_REF.game_data.village.iron){
						szem4_EPITO_infoCell(PMEP[2],"yellow","Nyersanyag hi�ny l�pett fel. �p�t�s m�g "+bido+" percig.");
					} else { /*Akkor m�r van 2 �p�let?*/
						if (blista.split(";")[1].length>2) {
							szem4_EPITO_infoCell(PMEP[2],"alap","�p�t�si sor megtelt. �p�t�s m�g "+bido+" percig.");
						} else { /*Ez se? Akkor... nem tom :S*/
							szem4_EPITO_infoCell(PMEP[2],"blue","Ismeretlen ok miatti �ll�s. �p�t�s m�g "+bido+" percig.");
						}
					}
				if (bido1>0) szem4_EPITO_addIdo(PMEP[2],bido1); else szem4_EPITO_addIdo(PMEP[2],30);
				return;
			}
			if (ok==build) { 
				if (bido1>0) szem4_EPITO_addIdo(PMEP[2],bido1); else szem4_EPITO_addIdo(PMEP[2],60); 
			} else {
				if (ok=="farm" && parseInt(EPIT_REF.game_data.village.buildings.farm)>=30) {
					/*Nem lehet t�bb �p�letet �p�teni, mert megtelt a tanya*/ 
					szem4_EPITO_addIdo(PMEP[2],180);
					szem4_EPITO_infoCell(PMEP[2],"blue","A tanya maxon, �s megtelt.");
					/*Esetleg m�g rakt�rat?*/
					for (var i=0;i<pcel;i++){
						if (pcel.split(" ")[0]=="storage"){
							if (parseInt(pcel.split(" ")[1],10)>EPIT_REF.game_data.village.buildings.storage) 
								try{szem4_EPITO_getBuildLink(EPIT_REF,"storage").click(); szem4_EPITO_addIdo(PMEP[2],60);}catch(e){}
						}
					}
				} else {
					if (EPIT_REF.$("#main_buildlink_"+ok).is(":visible")) {
						szem4_EPITO_getBuildLink(EPIT_REF,ok).click(); 
					} else { /*A hib�t okoz� �p�let sem �p�thet�. Speci�lis legend hiba: farm-ot kell venni, de kicsi a rakt�r hozz� :) */
						if (blista.split(";")[1]!="") szem4_EPITO_infoCell(PMEP[2],"alap","Tany�t vagy rakt�rat k�ne h�zni, de teli van a sor most. �p�t�s m�g "+bido+" percig.");
						else 
						szem4_EPITO_infoCell(PMEP[2],"yellow","Nyersanyag hi�ny!? Tany�t vagy rakt�rat k�ne h�zni, de nem tudom betenni. �p�t�s m�g "+bido+" percig.");
						if (bido1>0) szem4_EPITO_addIdo(PMEP[2],bido1); else szem4_EPITO_addIdo(PMEP[2],60);
					}
				}
			}
		}
	} else {
		/*L�tezik ilyen �p�let egy�ltal�n?*/
		i=-2; var letezo=false;
		for (var elem in GD){
			i++; if (i==-1) continue;
			if(elem==build) {letezo=true;break;}
		}
		if (!letezo) {
			szem4_EPITO_infoCell(PMEP[2],"red","Nem l�tez� �p�letet ("+build+") akarsz �p�teni."); 
			szem4_EPITO_addIdo(PMEP[2],60);
			naplo("�p�t�","A(z) \""+PMEP[2].cells[1].getElementsByTagName("select")[0].value+"\" nev� �p�t�si lista nem l�tez� �p�letet tartalmaz!"); 
			throw "Nem l�tez� �p�let: "+build;
		}
		
		/*L�tezik, teh�t el�felt�tel nincs meg. Van �p�t�s alatt valami?*/
		if (!(bido1>0)) {
			szem4_EPITO_infoCell(PMEP[2],"red","A soron k�vetkez� �p�lethez ("+build+") m�s �p�letek sz�ks�geltetnek.");
			szem4_EPITO_addIdo(PMEP[2],60);
			naplo("�p�t�","El�felt�teleknek nem megfelel� �p�t�si list�t tartalmaz a(z) \""+PMEP[2].cells[1].getElementsByTagName("select")[0].value+"\" �p�t�si lista!"); 
			throw "Rossz �p�t�si lista";
		}
		
		/*M�g v�runk, mert �p�t�nk*/
		szem4_EPITO_infoCell(PMEP[2],"alap","Jelenleg el�felt�tel �p�l.");
		if (bido1>0) szem4_EPITO_addIdo(PMEP[2],bido1); else {debug("�p�t�","Anom�lia: H4f"); szem4_EPITO_addIdo(PMEP[2],60);}
	}
	return;
}catch(e){debug("epit_IntelliB",e);}}

function szem4_EPITO_motor(){try{
	var nexttime=2000;
	if (BOT||EPIT_PAUSE) {nexttime=5000;} else {
	if (EPIT_HIBA>10) {EPIT_HIBA=0; EPIT_GHIBA++; if(EPIT_GHIBA>3) {if (EPIT_GHIBA>5) {naplo("Glob�l","Nincs internet? Folyamatos hiba az �p�t�n�l"); nexttime=60000; playSound("bot2");} EPIT_REF.close();} EPIT_LEPES=0;}
	switch (EPIT_LEPES){
		case 0: PMEP=szem4_EPITO_Wopen(); /*FaluID;lista;link_a_faluhoz*/
				if (PMEP[0]>0){
				EPIT_REF=window.open(VILL1ST.replace("screen=overview","screen=main").replace(/village=[0-9]+/,"village="+PMEP[0]),AZON+"_SZEM4EPIT"); 
				EPIT_LEPES=1;} else {
					if (document.getElementById("epit_lista").rows.length==1) nexttime=5000; else nexttime=100000;
				} break;
		case 1: if (isPageLoaded(EPIT_REF,PMEP[0],"screen=main")) {EPIT_HIBA=0; EPIT_GHIBA=0;
					/*PMEP=*/szem4_EPITO_IntettiBuild(PMEP[1]);
				} else {EPIT_HIBA++;}
				EPIT_LEPES=0;
				break;
		default: EPIT_LEPES=0;
	}
	
	/*
	 1.) Megn�zz�k melyik falut kell megnyitni -->f�hadi.
	 2.) <5 sor? Mit kell venni? Lehets�ges e? Ha nem, lehet e valamikor az �letbe? (tanya/rakt�r-vizsg�lat)
	 3.) Nincs! xD
	*/}
}catch(e){debug("Epito motor",e); EPIT_LEPES=0;}
var inga=100/((Math.random()*40)+80);
nexttime=Math.round(nexttime*inga);
setTimeout("szem4_EPITO_motor()",nexttime);}

ujkieg_hang("�p�t�","epites;falu_kesz;kritikus_hiba");
ujkieg("epit","�p�t�",'<tr><td><h2 align="center">�p�t�si list�k</h2><table align="center" class="vis" style="border:1px solid black;color: black;"><tr><th onmouseover=\'sugo("�p�t�si lista neve, amire k�s�bb hivatkozhatunk")\'>Csoport neve</th><th onmouseover=\'sugo("Az �p�t�si sorrend megad�sa. Saj�t lista eset�n ellen�rizz�k az OK? linkre kattintva annak helyess�g�t!")\' style="width:800px">�p�t�si lista</th></tr><tr><td>Alap�rtelmezett</td><td><input type="text" disabled="disabled" value="main 10;storage 10;wall 10;main 15;wall 15;storage 15;farm 10;main 20;wall 20;MINES 10;smith 5;barracks 5;stable 5;main 15;storage 20;farm 20;market 10;main 22;smith 12;farm 25;storage 28;farm 26;MINES 24;market 19;barracks 15;stable 10;garage 5;MINES 26;farm 28;storage 30;barracks 20;stable 15;farm 30;barracks 25;stable 20;MINES 30;smith 20;snob 1" size="125"><a onclick="szem4_EPITO_cscheck(this)" style="color:blue; cursor:pointer;"> OK?</a></td></tr></table><p align="center">Csoportn�v: <input type="text" value="" size="30" id="epit_ujcsopnev" placeholder="Nem tartalmazhat . _ ; karaktereket"> <a href="javascript: szem4_EPITO_ujCsop()" style="color:white;text-decoration:none;"><img src="'+pic("plus.png")+' " height="17px"> �j csoport</a></p></td></tr><tr><td><h2 align="center">�p�tend� faluk</h2><table align="center" class="vis" style="border:1px solid black;color: black;width:900px" id="epit_lista"><tr><th style="width: 75px; cursor: pointer;" onclick=\'rendez("szoveg",false,this,"epit_lista",0)\' onmouseover=\'sugo("Rendezhet�. Itt �p�tek. Dupla klikk a falura = sor t�rl�se")\'>Falu koord.</th><th onclick=\'rendez("lista",false,this,"epit_lista",1)\' onmouseover=\'sugo("Rendezhet�. Fels� t�bl�zatban haszn�lt lista k�z�l v�laszthatsz egyet, melyet k�s�bb b�rmikor megv�ltoztathatsz.")\' style="width: 135px; cursor: pointer">Haszn�lt lista</th><th style="width: 220px; cursor: pointer;" onclick=\'rendez("datum",false,this,"epit_lista",2)\' onmouseover=\'sugo("Rendezhet�. Ekkor fogom �jran�zni a falut, hogy lehet e m�r �p�teni.<br>Dupla klikk=id� azonnalira �ll�t�sa.")\'>Return</th><th style="cursor: pointer;" onclick=\'rendez("szoveg",false,this,"epit_lista",3)\' onmouseover=\'sugo("Rendezhet�. Sz�veges inform�ci� a faluban zajl� �p�t�sr�l. S�rga h�tter� sz�veg orvosolhat�; k�k jelent�se hogy nem tud haladni; piros pedig kritikus hib�t jel�l; a sz�n n�lk�li a norm�lis m�k�d�st jelzi.<br>Dupla klikk=alaphelyzet")\'><u>Inf�</u></th></tr></table><p align="center" id="epit_ujfalu_adat">\
Csoport:  <select><option value="Alap�rtelmezett">Alap�rtelmezett</option> </select> \
Faluk: <input type="text" value="" placeholder="Koordin�t�k: 123|321 123|322 ..." size="50"> \
<a href="javascript: szem4_EPITO_ujFalu()" style="color:white;text-decoration:none;"><img src="'+pic("plus.png")+'" height="17px"> �j falu(k)</a></p></td></tr>');
/*Dupla klikk esem�nyek; s�g�; inf�ba linkmegnyit�s*/
/*Table IDs:  farm_opts; farm_honnan; farm_hova*/
var EPIT_LEPES=0;
var EPIT_REF; var EPIT_HIBA=0; var EPIT_GHIBA=0;
var PMEP; var EPIT_PAUSE=false;
szem4_EPITO_motor();
szem4_EPITO_perccsokkento();

/*-----------------Export/Import kezel�--------------------*/
function szem4_ADAT_saveNow(tipus){
 switch (tipus){
	case "farm": szem4_ADAT_farm_save(); break;
	case "epito": szem4_ADAT_epito_save(); break;
	case "sys": szem4_ADAT_sys_save(); break;
 }
 return;
}

function szem4_ADAT_restart(tipus){
	switch (tipus){
		case "farm": localStorage.setItem(AZON+"_farm",'3600.4.0.3600.1.false.false.100.10.500.90;;;;;;'); szem4_ADAT_farm_load(); break;
		case "epito": localStorage.setItem(AZON+"_epito",'__'); szem4_ADAT_epito_load(); break;
		case "sys": localStorage.setItem(AZON+"_sys",'Fatelep.Agyagb�nya.Vasb�nya.Fal.false;false.false.false;http://www youtube com/watch?v=k2a30--j37Q.true.true.true.true.true.true;'); 
	szem4_ADAT_sys_load(); break;
	}
}

function szem4_ADAT_StopAll(){
	var tabla=document.getElementById("adat_opts").rows;
	for (var i=1;i<tabla.length;i++){
		tabla[i].cells[0].getElementsByTagName("input")[0].checked=false;
	}
	return;
}

function szem4_ADAT_LoadAll(){
	szem4_ADAT_farm_load();
	szem4_ADAT_epito_load();
	szem4_ADAT_sys_load();
}

function szem4_ADAT_sys_save(){try{
	var eredmeny="";
	/*VIJE*/
	var adat=document.getElementById("vije").getElementsByTagName("input");
	for (var i=0;i<adat.length;i++){
		if (adat[i].getAttribute("type")=="checkbox") {
			if (adat[i].checked) eredmeny+="true"; else eredmeny+="false"; 
		} else eredmeny+=adat[i].value;
		if (i<adat.length-1) eredmeny+=".";
	}	
	eredmeny+=";";
	
	/*Adatment�*/
	var adat=document.getElementById("adatok").getElementsByTagName("input");
	for (var i=0;i<adat.length;i++){
		if (adat[i].checked) eredmeny+="true"; else eredmeny+="false"; 
		if (i<adat.length-1) eredmeny+=".";
	}
	eredmeny+=";";
		/*Hangok*/
	var adat=document.getElementById("hang").getElementsByTagName("input");
	for (var i=0;i<adat.length;i++){
		if (adat[i].getAttribute("type")=="checkbox") {
			if (adat[i].checked) eredmeny+="true"; else eredmeny+="false"; 
		} else eredmeny+=adat[i].value.replace(/\./g," ").replace(/;/g,"  ");
		if (i<adat.length-1) eredmeny+=".";
	}
	eredmeny+=";";
	
	localStorage.setItem(AZON+"_sys",eredmeny);
	var d=new Date(); document.getElementById("adat_opts").rows[3].cells[2].textContent=d;
	return;
}catch(e){debug("ADAT_sys_save",e);}}

function szem4_ADAT_farm_save(){try{
	var eredmeny="";
	/*Options*/
	var adat=document.getElementById("farm_opts").rows[2].cells[1].getElementsByTagName("input");
	for (var i=0;i<adat.length;i++){
		if (adat[i].type=="checkbox") {
			if (adat[i].checked) eredmeny+="true"; else eredmeny+="false";
		} else {eredmeny+=adat[i].value;}
		if (i<adat.length-1) eredmeny+=".";
	}
	
	/*Farm_honnan*/
	eredmeny+=";";
	adat=document.getElementById("farm_honnan").rows;
	for (var i=1;i<adat.length;i++){
		eredmeny+=adat[i].cells[0].textContent;
		if (i<adat.length-1) eredmeny+=".";
	}
	eredmeny+=";";
	
	var seged;
	for (var i=1;i<adat.length;i++){
		seged=adat[i].cells[1].getElementsByTagName("input");
		for (var j=0;j<seged.length;j++){
			if (seged[j].checked) eredmeny+="true"; else eredmeny+="false";
			if (j<seged.length-1) eredmeny+="-";
		}
		if (i<adat.length-1) eredmeny+=".";
	}
	
	/*Farm_hova*/
	eredmeny+=";";
	adat=document.getElementById("farm_hova").rows;
	for (var i=1;i<adat.length;i++){
		eredmeny+=adat[i].cells[0].textContent;
		if (adat[i].cells[0].style.backgroundColor=="red") eredmeny+="R";
		if (i<adat.length-1) eredmeny+=".";
	} eredmeny+=";";
	for (var i=1;i<adat.length;i++){
		eredmeny+=adat[i].cells[1].textContent;
		if (i<adat.length-1) eredmeny+=".";
	} eredmeny+=";";
	for (var i=1;i<adat.length;i++){
		eredmeny+=adat[i].cells[2].textContent;
		if (i<adat.length-1) eredmeny+=".";
	} eredmeny+=";";
	for (var i=1;i<adat.length;i++){
		if (adat[i].cells[4].getElementsByTagName("input")[0].checked) eredmeny+="true"; else eredmeny+="false";
		if (i<adat.length-1) eredmeny+=".";
	}
	localStorage.setItem(AZON+"_farm",eredmeny);
	var d=new Date(); document.getElementById("adat_opts").rows[1].cells[2].textContent=d;
	return;
}catch(e){debug("ADAT_farm_save",e);}}

function szem4_ADAT_epito_save(){try{
	var eredmeny="";
	/*Csoportok*/
	var adat=document.getElementById("epit").getElementsByTagName("table")[0].rows;
	for (var i=2;i<adat.length;i++){
		eredmeny+=adat[i].cells[0].textContent+"-"+adat[i].cells[1].getElementsByTagName("input")[0].value;
		if (i<adat.length-1) eredmeny+=".";
	}
	
	/*Falulista*/
	eredmeny+="_";
	adat=document.getElementById("epit").getElementsByTagName("table")[1].rows;
	for (var i=1;i<adat.length;i++){
		eredmeny+=adat[i].cells[0].textContent;
		if (i<adat.length-1) eredmeny+=".";
	}
	eredmeny+="_";
	for (var i=1;i<adat.length;i++){
		eredmeny+=adat[i].cells[1].getElementsByTagName("select")[0].value;
		if (i<adat.length-1) eredmeny+=".";
	}
	localStorage.setItem(AZON+"_epito",eredmeny);
	var d=new Date(); document.getElementById("adat_opts").rows[2].cells[2].textContent=d;
	return;
}catch(e){debug("ADAT_epito_save",e);}}

function szem4_ADAT_farm_load(){try{
	if(localStorage.getItem(AZON+"_farm")) var suti=localStorage.getItem(AZON+"_farm"); else return;
/*Be�ll�t�sok: sim�n value=, a checkbox speci�lis eset*/
	var adat=document.getElementById("farm_opts").rows[2].cells[1].getElementsByTagName("input");
	var resz=suti.split(";")[0].split(".");
	for (var i=0;i<resz.length;i++)	{
		if (resz[i]=="true") adat[i].checked=true; else
			if (resz[i]=="false") adat[i].checked=false; else
				adat[i].value=resz[i];
	}
/*START: Minden adat t�rl�se a honnan;hova t�bl�zatokb�l!*/
	adat=document.getElementById("farm_honnan");
	for (var i=adat.rows.length-1;i>0;i--) adat.deleteRow(i);
	adat=document.getElementById("farm_hova");
	for (var i=adat.rows.length-1;i>0;i--) adat.deleteRow(i);
/*Honnan: kit�lti a hozz�ad�st, 1 1s�g bepip�l�s�val (az els� j� lesz), majd v�gigmegy a 2. oszlopon pip�lgatni*/
	document.getElementById("farm_opts").rows[1].cells[0].getElementsByTagName("input")[0].value=suti.split(";")[1];
	document.getElementById("farm_opts").rows[2].cells[0].getElementsByTagName("input")[0].checked=true;
	add_farmolo();
	
/*Hova: Hozz�ad�s haszn�lata koordikkal, k�s�bb b�nya;fal �ll�t�s; nyers-et pedig a hat�rsz�mra �ll�tja.*/	
	document.getElementById("farm_opts").rows[1].cells[1].getElementsByTagName("input")[0].value=suti.split(";")[3];
	add_farmolando();
	
	setTimeout(function(){try{
		alert2("OK");
		var suti=localStorage.getItem(AZON+"_farm");
		var resz=suti.split(";")[0].split(".");
		var adat=document.getElementById("farm_honnan").rows;
		if (suti.split(";")[2].indexOf(".")>-1) {resz=suti.split(";")[2].split(".");
		for (var i=0;i<resz.length;i++){
			var hely=adat[i+1].cells[1].getElementsByTagName("input");
			for (var j=0;j<resz[i].split("-").length;j++){
				if (resz[i].split("-")[j]=="true") hely[j].checked=true; else hely[j].checked=false;
			}
		}}
		/*Bet�lt�s: farmok r�szletei*/
		adat=document.getElementById("farm_hova").rows;
		resz=suti.split(";")[2].split(".");
		for (var i=0;i<resz.length;i++) if (resz[i].indexOf("R")>0) adat[i+1].cells[0].style.backgroundColor="red";
		
		resz=suti.split(";")[4].split(".");
		for (var i=0;i<resz.length;i++) adat[i+1].cells[1].textContent=resz[i];
		
		resz=suti.split(";")[5].split(".");
		for (var i=0;i<resz.length;i++) adat[i+1].cells[2].textContent=resz[i];
		
		resz=suti.split(";")[6].split(".");
		for (var i=0;i<resz.length;i++) resz[i]=="true"?adat[i+1].cells[4].getElementsByTagName("input")[0].checked=true:adat[i+1].cells[4].getElementsByTagName("input")[0].checked=false;
		
		document.getElementById("farm_opts").rows[2].cells[0].getElementsByTagName("input")[0].checked=false;	
		alert2("Farmol�si adatok bet�lt�se k�sz.");
	}catch(e){alert("ERROR_LOAD\n"+e);}},700);
}catch(e){debug("ADAT_farm_load",e);}void(0);}

function szem4_ADAT_epito_load(){try{
	if(localStorage.getItem(AZON+"_epito")) var suti=localStorage.getItem(AZON+"_epito"); else return;
	/* START: Minden adat t�rl�se a list�b�l �s falukb�l!*/
	var adat=document.getElementById("epit").getElementsByTagName("table")[0];
	for (var i=adat.rows.length-1;i>1;i--){
		adat.deleteRow(i);
	}
	var adat=document.getElementById("epit").getElementsByTagName("table")[1];
	for (var i=adat.rows.length-1;i>0;i--){
		adat.deleteRow(i);
	}
	adat=document.getElementById("epit_ujfalu_adat").getElementsByTagName("select")[0];
	while (adat.length>1) adat.remove(1);
	
	/*�j csoport gomb haszn�lata, ut�na m�dos�t�s - ezt egyes�vel*/
	adat=suti.split("_")[0].split(".");
	for (var i=0;i<adat.length;i++){
		document.getElementById("epit_ujcsopnev").value=adat[i].split("-")[0];
		szem4_EPITO_ujCsop();
		document.getElementById("epit").getElementsByTagName("table")[0].rows[i+2].cells[1].getElementsByTagName("input")[0].value=adat[i].split("-")[1];
	}
	/*�j faluk hozz�ad�sa gomb, majd select �ll�t�sa*/
	adat=suti.split("_")[1].split(".");
	document.getElementById("epit_ujfalu_adat").getElementsByTagName("input")[0].value=adat;
	szem4_EPITO_ujFalu();
	
	adat=suti.split("_")[2].split(".");
	var hely=document.getElementById("epit").getElementsByTagName("table")[1].rows;
	for (var i=0;i<adat.length;i++){
		hely[i+1].cells[1].getElementsByTagName("select")[0].value=adat[i];
	}
	alert2("�p�t�si adatok bet�lt�se k�sz.");
	return;
}catch(e){debug("ADAT_epito_load",e);}}

function szem4_ADAT_sys_load(){ try{
	if(localStorage.getItem(AZON+"_sys")) var suti=localStorage.getItem(AZON+"_sys"); else return;
	/*VIJE*/
	var adat=document.getElementById("vije").getElementsByTagName("input");
	var resz=suti.split(";")[0].split(".");
	for (var i=0;i<resz.length;i++){
		if (resz[i]=="true") adat[i].checked=true; else
		 if (resz[i]=="false") adat[i].checked=false; else
		  adat[i].value=resz[i];
	}
	
	/*Adatment�*/
	var adat=document.getElementById("adat_opts").getElementsByTagName("input");
	var resz=suti.split(";")[1].split(".");
	for (var i=0;i<resz.length;i++){
		if (resz[i]=="true") adat[i].checked=true; else
		 if (resz[i]=="false") adat[i].checked=false;
	}
	
	/*Hangok*/
	var adat=document.getElementById("hang").getElementsByTagName("input");
	var resz=suti.split(";")[2].split(".");
	adat[0].value=resz[0].replace(/  /g,";").replace(/ /g,".");
	for (var i=1;i<resz.length;i++){
		if (resz[i]=="true") adat[i].checked=true; else
		 if (resz[i]=="false") adat[i].checked=false;
	}
	alert2("Rendszereadatok bet�lt�se k�sz.");
}catch(e){debug("ADAT_epito_sys",e);}}

function szem4_ADAT_del(tipus){try{
	if (!confirm("Biztos t�rli a(z) "+tipus+" �sszes adat�t?")) return;
	if (localStorage.getItem(AZON+"_"+tipus)){
		localStorage.removeItem(AZON+"_"+tipus);
		alert2(tipus+": T�rl�s sikeres");
	} else alert2(tipus+": Nincs lementett adat");
	return;
}catch(e){debug("ADAT_epito_load",e);}}

function szem4_ADAT_kiir(tipus){try{
	if (localStorage.getItem(AZON+"_"+tipus)){
		alert2("<textarea onmouseover='this.select()' onclick='this.select()' cols='38' rows='30'>"+localStorage.getItem(AZON+"_"+tipus)+"</textarea>");
	} else alert2("Nincs lementett adat");
	return;
}catch(e){debug("szem4_ADAT_kiir",e);}}

function szem4_ADAT_betolt(tipus){try{
	var beadat=prompt("Adja meg a kor�bban SZEM4 �LtAL KI�RT ADATOT, melyet be k�v�n t�lteni.\n\n Ne pr�b�lj k�zileg be�rni ide b�rmit is. Helytelen adat megad�s�t SZEM4 nem tudja kezelni, az ebb�l ad�d� m�k�d�si rendelleness�g csak RESET-el�ssel �ll�that� helyre.");
	if (beadat==null || beadat=="") return;
	localStorage.setItem(AZON+"_"+tipus,beadat);
	if (tipus=="farm") szem4_ADAT_farm_load();
	if (tipus=="epito") szem4_ADAT_epito_load();
	alert2("Az adatok sikeresen bet�lt�dtek.");
}catch(e){debug("szem4_ADAT_betolt",e);}}

function szem4_ADAT_motor(){try{if (!ADAT_PAUSE){
	if (ADAT_FIRST) ADAT_FIRST=false; else {
	var Z=document.getElementById("adat_opts").rows;
	if (Z[1].cells[0].getElementsByTagName("input")[0].checked) szem4_ADAT_farm_save();
	if (Z[2].cells[0].getElementsByTagName("input")[0].checked) szem4_ADAT_epito_save();
	if (Z[3].cells[0].getElementsByTagName("input")[0].checked) szem4_ADAT_sys_save();}
}}catch(e){debug("ADAT_motor",e);}
setTimeout("szem4_ADAT_motor()",60000);}

function szem4_ADAT_AddImageRow(tipus){
	return '\
	<img title="Jelenlegi adat bet�lt�se" alt="Bet�lt" onclick="szem4_ADAT_'+tipus+'_load()" width="17px" src="'+pic("load.png")+'"> \
	<img title="T�rl�s" alt="T�r�l" onclick="szem4_ADAT_del(\''+tipus+'\')" src="'+pic("del.png")+'" width="17px""> \
	<img title="Jelenlegi adat kiirat�sa" alt="Export" onclick="szem4_ADAT_kiir(\''+tipus+'\')" width="17px" src="'+pic("Export.png")+'"> \
	<img title="Saj�t adat bet�lt�se" alt="Import" onclick="szem4_ADAT_betolt(\''+tipus+'\')" width="17px" src="'+pic("Import.png")+'"> \
	<img title="Ment�s MOST" alt="Save" onclick="szem4_ADAT_saveNow(\''+tipus+'\')" width="17px" src="'+pic("saveNow.png")+'">\
	<img title="Reset: Helyre�ll�t�s" alt="Reset" onclick="szem4_ADAT_restart(\''+tipus+'\')" width="17px" src="'+pic("reset.png")+'">';
}

ujkieg("adatok","Adatment�",'<tr><td>\
<p align="center"><b>Figyelem!</b> Az adatment� legels� elind�t�sakor bet�lti a lementett adatokat (ha van), nem t�r�dve azzal, hogy jelenleg mi a munkafolyamat.<br>�j adatok haszn�lat�hoz az adatment� ind�t�sa el�tt haszn�ld a t�rl�st a lenti t�bl�zatb�l.</p>\
<table class="vis" id="adat_opts" style="width:100%; margin-bottom: 50px;"><tr><th style="width:105px">Enged�lyez�s</th><th style="width:118px">Kieg�sz�t� neve</th><th style="width:250px">Utols� ment�s ideje</th><th  style="width:93px">Adat kezel�se</th></tr>\
<tr><td><input type="checkbox" checked></td><td>Farmol�</td><td></td><td>'+szem4_ADAT_AddImageRow("farm")+'</td></tr>\
<tr><td><input type="checkbox" checked></td><td>�p�t�</td><td></td><td>'+szem4_ADAT_AddImageRow("epito")+'</td></tr>\
<tr><td><input type="checkbox" checked></td><td>VIJE,Adatment�,Hangok</td><td></td><td>'+szem4_ADAT_AddImageRow("sys")+'</td></tr>\
</table><p align="center"></p></td></tr>');
var ADAT_PAUSE=false, ADAT_FIRST=true;
if (!confirm("Enged�lyezed az adatok ment�s�t?\nK�s�bb elind�thatja, ha visszapip�lja a ment�s enged�lyez�s�t - ekkor sz�ks�ges k�zi adatbet�lt�s is el�tte.")) szem4_ADAT_StopAll(); else szem4_ADAT_LoadAll();

szem4_ADAT_motor();


void(0);