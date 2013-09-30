openstreetmap-carto-typos
=========================

Search for typos in openstreetmap cartocss stylesheets. This searches for key-value tag selectors in cartocss files and cross-checks those with the taginfo database.

Installation
------------

1. install sqlite3 module
  
        npm install sqlite3
  
2. grab taginfo database files
  
        wget http://taginfo.openstreetmap.org/download/taginfo-master.db.bz2
        wget http://taginfo.openstreetmap.org/download/taginfo-wiki.db.bz2
  
3. unpack taginfo db
  
        bzip2 -d *.bz2

Running
-------

    node typo.js <path to carto stylesheet.mss>

