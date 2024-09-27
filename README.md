# Ecommerce con attributi variabili

[demo.webm](https://github.com/user-attachments/assets/8a3bc675-5566-4e81-b3fa-14757edb67e4)

## Panoramica dell'applicazione

Si tratta di una SPA, creata con Laravel e React (connessi tramite Inertia.js), la quale utilizza un database Mysql. Sono anche presenti i test di alcune feature (eseguiti tramite PHPUnit).

Un prodotto appartiene a una determinata categoria. Ogni categoria ha dei propri attributi i quali possono essere definiti nella pagina di modifica della categoria, mediante tipologia, nome e unita' di misura. Attualmente ma le tipologie sono 3: Intero, decimale e stringa.

Ogni prodotto di una determinata categoria riporta gli attributi della categoria ed e' possibile valorizzarli nella pagina di modifica del prodotto. Se viene aggiunto/rimosso un'attributo dalla categoria verra' automaticamente aggiunto/rimosso l'attributo da tutti i prodotti appartenenti a essa.

La sezione esplora permette, dopo aver scelto una categoria, di filtrarne i prodotti in base agli attributi definiti nella categoria e i relativi valori per ogni prodotto. Per ogni attributo (con almeno un prodotto che lo ha valorizzato) viene mostrato un filtro: nel caso di attributi numerici e' possibile definire un limite superiore e uno inferiore, mentre per gli attributi testuali vengono mostrati tutti i possibili valori e se ne puo' scegliere uno o piu' da filtrare.

## DB

Il Database ha 4 tabelle principali per gestire categorie, prodotti e attributi:

- categories: Contiene le categorie.

- category_attributes: Contiene gli attributi delle categorie, con il riferimento alla relativa categoria e alla tipologia di attributo (dalla tabella category_attribute_types).

- products: Contiene i prodotti, e il riferimento alla relativa categoria.

- product_attributes: Contiene i valori di un prodotto per un determinato attributo della sua categoria. E' come se fosse un'istanza dell'attributo della categoria relativo a uno specifico prodotto.

- category_attribute_types, users, ...etc: tabelle secondarie

## Dipendenze

(Queste sono le dipendenze per lo sviluppo su Ubuntu 24, in caso di sviluppo su window consiglio di usare XAMPP o comunque seguire una guida)

- apache2: server version Apache/2.4.58 (Ubuntu)
- php: v. 8.3.11
- composer: v. 2.7.9
- mysql: v. 8.0.39-0ubuntu0.24.04.2 for Linux on x86_6
- npm: v. 9.2.0
- drivers php-database
	- php8.3-mysql
	- php8.3-sqlite3 (DB in-memory per i test, opzionale)

## Setup

- clonare il repository
- entrare nella cartella del progetto (quella contente "artisan")
- `composer install`
- `artisan key:generate`
- rinominare `.env.example` come `.env`
- create il database e valorizzare i campi relativi al DB all'interno del file `.env`:
```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=<nome DB>
DB_USERNAME=<nome utente con accesso al DB>
DB_PASSWORD=<password utente>
```
- `php artisan migrate:fresh --seed` (crea il DB e lo valorizza con dei dati, in parte generati casualmente)
- `php storage link`
- `npm install`

## Esecuzione server locale

Per eseguire il server in locale serve eseguire in parallelo:
- `php artisan serve`
- `npm run dev`

Il sito sara' presente all'indirizzo mostrato in seguito all'esecuzione del comando "serve" di artisan.
