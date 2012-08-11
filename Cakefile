fs = require "fs"
{parser, uglify} = require "uglify-js"
coffee = require "coffee-script"
eco = require "eco"
less = require "less"
csso = require 'csso'

task "build", "Ready for production", ->
  build()

task "build:debug", "Build without minifying", ->
  build true

task "watch", "Watch for changes, then build", ->
  watch()

task "watch:debug", "Watch for changes without minifying", ->
  watch true

task "clean", "Clean up generated files", ->
    fs.unlinkSync "css/style.css"
    fs.rmdirSync "css"
    fs.unlinkSync "js/script.js"
    console.log "Cleaned up"

build = (debug = false) ->
  CSSmin = if debug then (css, callback) -> callback css
  else (css, callback) -> minifyCSS css, (css) -> callback css

  compileLess (css) ->
    CSSmin css, (css) ->
      fs.writeFile "css/style.css", css, ->
        console.log "CSS saved into css/style.css"

  JSmin = if debug then (js, callback) -> callback js
  else (js, callback) -> minifyJS js, (js) -> callback js

  compileEco "", (js) ->
    compileCoffee js, (js) ->
        JSmin js, (js) ->
          fs.writeFile "js/script.js", js, ->
            console.log "JS saved into js/script.js"

watch = (debug = false) ->
  build debug
  for dir in ['.', 'coffee', 'less', 'less/lib', 'js/lib']
    fs.watch dir, (event) ->
      build debug

compileLess = (callback) ->
    fs.readFile "less/everything.less", "utf-8", (err, contents) ->
        throw err if err
        less_parser = new(less.Parser) paths: ["./less/"]
        less_parser.parse contents, (e, tree) ->
            console.error e if e
            css = tree.toCSS()
            callback?(css)

minifyCSS = (css, callback) ->
  callback csso.justDoIt css

compileCoffee = (js, callback) ->
    fs.readdir "coffee", (err, files) ->
        throw err if err
        files = (file for file in files when not fs.statSync("coffee/#{file}").isDirectory())
        for file in files
            do (file) ->
                contents = fs.readFileSync "coffee/#{file}", "utf-8"
                js += coffee.compile(contents) + "\n"
        callback?(js)

compileEco = (js, callback) ->
    js += "var ecoTemplates = {};\n"
    fs.readdir "templates", (err, files) ->
        throw err if err
        files = (file for file in files when not fs.statSync("templates/#{file}").isDirectory())
        for file in files
            do (file) ->
                contents = fs.readFileSync "templates/#{file}", "utf-8"
                js += """(function() {
                ecoTemplates['#{file.replace /(\.eco)?$/, ""}'] = #{eco.precompile contents};
                }).call(this);
                """
        callback?(js)

minifyJS = (js, callback) ->
    ast = parser.parse js
    ast = uglify.ast_mangle ast
    ast = uglify.ast_squeeze ast
    final_code = uglify.gen_code ast
    callback?(final_code)
