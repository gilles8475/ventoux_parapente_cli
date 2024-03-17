#Ce répertoire contient des CLI c'est à dire des scripts node js que l'on peut lancer en ligne de commande
##PPour générer une commande node JS il faut renseigner le fichier package.json en ajoutant une clé "bin":

ici on a :
....
  "bin": {
    "ventoux-weather": "index.js"
  },
....
Le fichier d'entrée devra aussi inclure le shabang #!/usr/bin/env node en tete de fichier.
ce qui signifie que la commande "ventoux-weather" lancera "index.js""
Pour que la commande soit prise en compte, il faut lancer:
sudo npm install -g 

#pour voir comment est créée cette commande faire un which *command*
en fait npm va créer des liens vers le fichier index.js. un fois cette commande créee on peut faire des modification sans avoir  à relancer npm install -g
