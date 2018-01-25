# bankin-scrap

## Description (FR):

Dans le cadre du challenge "engineering" organisé par : https://blog.bankin.com/.

J'ai créé ce script en utilisant CasperJS pour scrapper un site web avec des bugs intentionnels.


### Analyse:

Après avoir lu et analyse le fichier 'load.js' :
* Le script utilise plusieurs techniques d'obfuscation.
* Le script appelle la méthode 'generate' qui a son tour appelle la méthode 'doGenerate'.
* Ce dernier appel ce fait après un timeout de X secondes (le X est aleatoire).
* Si la variable 'hasiframe' est true le tableau des transactions est génèré dans un iframe.
* Si la variable 'failmode' est true, une alerte est affichée et le tableau n'est pas genere.


### Solutions:

L'idée est d'utiliser CasperJS pour scrapper le site et a chaque fois injecter un code JS avant de charger la page qui :

* Redéfinie la methode 'Math.random' pour retourner toujours la valeur 0.01.
	- Car les variables slowmode, failmode et hasiframe sont mis a true si (random*100) % 2 == 0.

Puis Après on :
* Scrappe les pages, et pour chaque page :
	- Vérifie si le tableau de transaction n'est pas vide, et le stock.
	- Sinon on stop.

### Notes:
* Pour executer le script :
``` bash
	casperjs scrape.js
```

* Le script 'calculate-average.py', calcule la moyenne des temps d'execution sur 50 exec.

* Le script est documenté en deux langue : javascript et en anglais.


## Description (EN):

This script is created for the challenge "engineering" organised by : http://blog.bankin.com/.

We are asked to scrape **all transactions** in a website. The website is full of intentional bugs, that we need to eliminate in order to get the job done.


### Analysis:

After doing some basic reverse engineering to the file 'load.js', I found out that :
* The script uses multiple obfuscation techniques.
* The script calls the methode 'generate', which then calls 'doGenerate'.
* The second call is done after a timeout of X seconds (X is randomly chosen).
* If the variable 'hasiframe' is true then the html table is generated in an iframe.
* If the variable 'failmode' is true then an alert is shown with a fail message.


### Solutions:

The idea was to create a CasperJS script, and each time a page is loaded we inject a javascript code which:
* Redefines Math.random to always return 0.01.
	- Because the variables slowmode, failmode and hasiframe are set to true if (random*100) % 2 == 0.

The scrape.js file then :
* Scrapes the pages and for every page:
	- Verifies if the table contains transaction, and store it.
	- Otherwise, we stop.

### Notes:
* To execute the script :
``` bash
	casperjs scrape.js
```

* The script 'calculate-average.py', gives the average running time over 50 runs.

* The script is documented in both javascript and english.
