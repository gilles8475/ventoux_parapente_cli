#!/usr/bin/env node
//Ceci est la version de la CLI avec le site entrée sous forme ventoux-weather --site=rissas --available
//l'option --available signifie qu'on ne souhaite afficher que les heures ou les conditions sont compatibles avec le site en question.
//La compatibilité est basée sur le les données de site de federation.ffvl.fr/terrain
//pour avoir des explication voir cette video:
//https://www.youtube.com/watch?v=oIg08Z0bqsY&list=PLC3y8-rFHvwh8shCMHFA5kWxD9PaPwxaY&index=59
const {arrowFromDirection, sectorFromDirection} = require("./arrows")
//const terrains=require('./deco_ventoux_liste.json')
const terrains=require('./terrains')
const code_meteo=require('./weather_code.json')
const inquirer=require('inquirer')

const terrains_available=[]
for (key in terrains){
        terrains_available.push(key)    
}
//creation d'un prompt avec listes de choix à l'aide du module inquirer
const prompt = inquirer.createPromptModule()
prompt([{
        type:"list",
        name:"site",
        choices:terrains_available,
        message: "Entrez le site parapente souhaité"
        },
        {
        type:"list",
        name:"days_forecast",
        choices:[1,2,3],
        message: "Entrez le nombre de jours de prévisions souhaité"
        },
        {
        type:"confirm",
        name:"available",
        message:"Afficher uniquement les données méteo compatibles avec le site"
        }
        ])
        .then((answer)=>{
                const site=answer.site
                const available=answer.available
                const dforecast=answer.days_forecast
                if (site==="help"){//ici c'est inutile mais j'ai laissé le code pour la version du script avec une invite standard avec des options
                        console.log("Usage : ventoux-weather --site=NAME [--available | -a]")
                        console.log("--available ou -a pour afficher uniquement les créneaux où le vent est compatible avec le site")
                        console.log("NAME peut prendre les valeurs suivantes: ")
                        terrains_available.forEach((value)=>{console.log("=>",value)})
                        process.exit(0)
                        }
                if (!terrains_available.includes(site)){//inutile aussi
                        console.log("les sites possibles sont:")
                        terrains_available.forEach((value)=>{console.log("=>",value)})
                        console.log("reessaye avec un  site dans cette liste")
                        console.log("Exemple : > ventoux-weather --site=saint-jean")
                        process.exit(1)
                }

                printMeteo(site,available,dforecast)
                console.log("Prévision Méteo Pour",site,"----------")
        })


//console.log("La meteo parapente autour du ventoux")

const converDate = (date)=>{
                const mois = ["janvier","fevrier","mars","avril","mai","juin","juillet","aout","septembre","octobre","novembre","decembre"]
                const mois_chiffre = ["01","02","03","04","05","06","07","08","09","10","11","12"]
                const jours = ["dimanche","lundi","mardi","mercredi","jeudi","vendredi","samedi"]
                const jours_short = ["dim","lun","mar","mer","jeu","ven","sam"]
                const d = new Date(date)
                //const heure= d.getHours() 
                const heure = date.split('-')[2].split('T')[1]
                const annee = d.getFullYear()
                const minute=d.getMinutes()
                //const jour=d.getDate()
                const jour=date.split('-')[2].split('T')[0]
                const jour_clair=jours_short[d.getDay()]
                const mois_clair = mois_chiffre[d.getMonth()]
                //return `${jour_clair} ${jour} ${mois_clair } ${annee} ${heure}h `
                return `${jour_clair} ${jour}/${mois_clair } ${heure}h `//version d'affichage courte sans l'année parcequ'on s'en fout un peu...
}

const printMeteo = async (site,available,dforecast)=>{
        const choice_site=terrains[site]
        const LAT=choice_site.lat
        const LON=choice_site.lon
        const url = `https://api.open-meteo.com/v1/meteofrance?latitude=${LAT}&longitude=${LON}&hourly=temperature_2m,weather_code,wind_speed_10m,wind_direction_10m,wind_gusts_10m&timezone=auto&forecast_days=${dforecast}&models=best_match`
        const response = await fetch(url)
        const forecast=await response.json()
        const date_time = forecast.hourly.time.map(converDate)
        const wind_speed_10m=forecast.hourly.wind_speed_10m
        const wind_direction_10m=forecast.hourly.wind_direction_10m
        const wind_gusts_10m = forecast.hourly.wind_gusts_10m
        const weather_code = forecast.hourly.weather_code.map((value)=>{return code_meteo[value.toString()].day.description})
        const wind_dir_10m_symbol=wind_direction_10m.map(arrowFromDirection)
        const wind_dir_10m_sector=wind_direction_10m.map(sectorFromDirection)
        const temperature_2m=forecast.hourly.temperature_2m
        const elevation = forecast.elevation

        const display=(index)=>{
                ladate=date_time[index]
                ventSymbol=wind_dir_10m_symbol[index]
                dirVent=wind_direction_10m[index].toString().padStart(3,"0")//on complete la direction avec des zero pour affichage propre
                VitesseVent=wind_speed_10m[index].toFixed(1).toString().padStart(4,' ')//précision 1 décimal et espace devant si besoin pour avoir un affichage propre
                VitesseRafale=wind_gusts_10m[index].toFixed(1).toString().padStart(4,' ')
                codeMeteo = weather_code[index].padEnd(28,' ')
                temperature = temperature_2m[index]

                console.log(ladate,"\tvent",ventSymbol,dirVent+"°",VitesseVent+"/"+VitesseRafale+" km/h",codeMeteo,"T°", temperature+'°c')
                }
                console.log("Altitude: ",elevation )
                console.log("latitude: ",forecast.latitude )
                console.log("longitude: ",forecast.longitude )
                

    //on parcourt le tableau win_dir_10m_sector pour afficher toutes les données récupérer de l'api. on aurait pu parcourir n'importe quelle autre tableau puisqu'ils ont tous la meme taille et ce qui nous intéresse c'est l'index
                wind_dir_10m_sector.forEach((value,index)=>{
                    if(available){//si l'option a ou available est entrée on filtre les secteurs de vent compatibles avec le site
                        if (choice_site.secteurs.includes(value)){
                                display(index)
                        }

                    }else{
                        display(index)
                    }
                })
}
