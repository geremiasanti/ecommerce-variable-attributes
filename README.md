# Ecommerce con attributi variabili

## Panoramica dell'applicazione

Si tratta di una SPA, creata con Laravel e React (connessi tramite Inertia.js), la quale utilizza un database Mysql.

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

## Setup
