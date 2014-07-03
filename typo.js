var fs = require("fs");
var sqlite3 = require("sqlite3").verbose();

var db = new sqlite3.Database("./taginfo-master.db", function(err) {
  if (err) console.log(err);
});

var f = fs.readFileSync(process.argv[2],"utf-8");

var m = f.match(/\[[a-zA-Z0-9_\-\:'"]+ ?= ?[a-zA-Z0-9_\-\:'"]+\]/g) || [];

var tags = [];
m.forEach(function(s) {
  s = s.match(/\[['"]?([a-zA-Z0-9_\-\:]+)['"]?\ ?=\ ?['"]?([a-zA-Z0-9_\-\:]+)['"]?\]/);
  if (s[1] === "feature") {
    s = s[2].match(/([a-zA-Z0-9\-\:]+)_([a-zA-Z0-9_\-\:]+)/);
  }
  tags.push({key:s[1], val:s[2]});
});



db.serialize(function() {
  db.exec("ATTACH DATABASE './taginfo-wiki.db' AS wiki;", function(err) {
    if (err) console.log(err);
  });
  tags.forEach(function(tag) {
    if (tag.key === "zoom")
      return;
    db.get("select count(*) as cnt from ("+
             //"select key,value from interesting_tags where key=$key and value=$value union "+
             "select key,value from suggestions where key=$key and value=$value union "+
             "select key,value from wiki.wikipages where key=$key and value=$value and (status<>'r' or (status='r' and body like '%Key:'||$key||'%'))"+
           ")",
           {$key:tag.key, $value:tag.val}, 
      function(err,row) {
        if (err) console.log(err);
        if (row.cnt===0)
          if (tag.val.match(/^INT/) !== null)
            console.log("INT\t", tag);
          else
            console.log("???\t", "["+tag.key+"="+tag.val+"](http://taginfo.openstreetmap.org/tags/"+encodeURIComponent(tag.key)+"="+encodeURIComponent(tag.val)+")");
        else
          console.log("OK\t", tag);
      });
  });
});
