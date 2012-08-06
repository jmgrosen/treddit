
fs = require "fs"
{parser, uglify} = require "uglify-js"
coffee = require "coffee-script"
less = require "less"
eco = require "eco"

task "build", "Ready for production", ->
    compileLess (css) ->
        writeFile "css/everything.css", css, "CSS", ->
            compileCoffee (js) ->
                compileEco js, (js) ->
                    compileJS js, (js) ->
                        writeFile "js/everything.js", js, "Javascript", ->
                            console.log "Done!"

task "watch", "Watch for changes, then build", ->
    invoke "build"
    fs.watch ".", (event) ->
        invoke "build"
    fs.watch "coffee", (event) ->
        invoke "build"
    fs.watch "less", (event) ->
        invoke "build"
    fs.watch "less/lib", (event) ->
        invoke "build"
    fs.watch "js/lib", (event) ->
        invoke "build"
    
compileLess = (callback) ->
    console.log "Compiling Less..."
    fs.readFile "less/everything.less", "utf-8", (err, contents) ->
        throw err if err
        less_parser = new(less.Parser) paths: ["./less/"]
        less_parser.parse contents, (e, tree) ->
            console.error e if e
            css = tree.toCSS(compress: true)
            callback?(css)

compileCoffee = (callback) ->
    console.log "Compiling Coffeescript..."
    fs.readdir "coffee", (err, files) ->
        throw err if err
        js = ""
        files = (file for file in files when not fs.statSync("coffee/#{file}").isDirectory())
        for file in files
            do (file) ->
                contents = fs.readFileSync "coffee/#{file}", "utf-8"
                js += coffee.compile(contents) + "\n"
        callback?(js)

compileEco = (js, callback) ->
    console.log "Compiling Eco..."
    fs.readdir "templates", (err, files) ->
        throw err if err
        files = (file for file in files when not fs.statSync("templates/#{file}").isDirectory())
        for file in files
            do (file) ->
                contents = fs.readFileSync "templates/#{file}", "utf-8"
                js += """
                    (function() {
                    this.ecoTemplates || (this.ecoTemplates = {});
                    this.ecoTemplates[#{JSON.stringify file.replace /(\.eco)?$/, ""}] = #{eco.precompile contents};
                  }).call(this);
                """
        callback?(js)

compileJS = (js, callback) ->
    console.log "Compiling JS..."
    ast = parser.parse js
    ast = uglify.ast_mangle ast
    ast = uglify.ast_squeeze ast
    final_code = uglify.gen_code ast
    callback?(final_code)

writeFile = (path, contents, description, callback) ->
    fs.writeFile path, contents, "utf8", (err) ->
        throw err if err
        console.log "#{description} saved into #{path}"
        callback?()