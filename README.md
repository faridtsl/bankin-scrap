# bankin-scrap

## Description (FR):

Dans le cadre du challenge "engineering" organisé par : https://blog.bankin.com/.

J'ai créé ce script en utilisant CasperJS pour scrapper un site web avec des bugs intentionnels.


### Analyse:

Après avoir lu et analyse le fichier 'load.js' :
* Le script utilise plusieurs techniques d'obfuscation.
* Le script appelle la méthode 'generate' qui a son tour appelle la méthode 'doGenerate'.
* Ce dernier appel ce fait après un timeout de 4s.
* Si la variable 'hasiframe' est true le tableau des transactions est génèré dans un iframe.
* Si la variable 'failmode' est true, une alerte est affichée.


### Solutions:

L'idée est d'utiliser CasperJS pour scrapper le site et a chaque fois injecter un code JS avant de charger la page qui :

* Redéfinie setTimeout pour éliminer les attentes inutiles.
* Déclare les variables 'hasiframe' et 'failmode' en lecture seule est, les initialise, a false.

Puis Après on :
* Scrappe les pages, et pour chaque page :
	- Vérifie si le tableau de transaction existe, et le stock.
	- Sinon il redemande la page.

### Notes:
* Pour executer le script :
``` bash
	casperjs scrape.js
```
* Le script est documenté en CasperJs (:p) et en anglais.


## Description (EN):

This script is created for the challenge "engineering" organised by : http://blog.bankin.com/.

The website is full of intentional bugs, that we need to eliminate in order to get the job done.


### Analysis:

After doing some basic reverse engineering to the file 'load.js', I found out that :
* The script uses multiple obfuscation techniques.
* The script calls the methode 'generate', which then calls 'doGenerate'.
* The second call is done after a timeout of 4s.
* If the variable 'hasiframe' is true then the html table is generated in an iframe.
* If the variable 'failmode' is true then an alert is shown with a fail message.


### Solutions:

The idea was to create a CasperJS script, and each time a page is loaded we inject the 'do.js' file:
* Redefines setTimeout to always wait only 1ms.
* Declare variables 'hasiframe' and 'failmode' in read-only mode, and initialize them to false.

The scrape.js file then :
* Scrapes the pages and for every page:
	- Verifies if the table containing the transactions exists, if so we memorize it.
	- Otherwise, we reload the page.

### Notes:
* To execute the script :
``` bash
	casperjs scrape.js
```
