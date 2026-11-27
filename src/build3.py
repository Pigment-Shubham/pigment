import re
h=open('01-head.html').read()
head=h.replace('<title>Pigment</title>','<meta name="theme-color" content="#ffffff">\n<meta name="apple-mobile-web-app-capable" content="yes">\n<meta name="apple-mobile-web-app-title" content="Pigment">\n<title>Pigment</title>',1)
head=head.replace('<style>','<style>\n[hidden]{display:none!important}html{color-scheme:light}body{margin:0;font:14px system-ui,sans-serif}img{max-width:100%}\n',1)
body=open('02-body.html').read()
js=''.join(open(f).read()+'\n' for f in ['03-gen.js','03b-more.js','03d-styles.js','03e-brand.js','03f-music.js','03g-premium.js','03h-aesthetics.js','03i-scenes.js','03j-radiance.js','03k-more.js','03m-recipe.js','03n-preview.js','03o-minimal.js','03c-reg.js','04-app.js','04b-look.js','04c-ui.js','04d-ui2.js','05-auth.js','06-brand.js','07-assistant.js'])
open('index.html','w').write('<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">'+head+'</head><body><noscript>Pigment needs JavaScript. Open this file in Chrome, Edge, Firefox or Safari.</noscript>'+body+'<script>'+js+'</script></body></html>')
s=open('index.html').read()
for pat in [r'<meta name="theme-color"[^>]*>\n',r'<meta name="apple-mobile-web-app-[^>]*>\n']:
    s=re.sub(pat,'',s)
s=s.replace('<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">','').replace('</head><body>','').replace('</body></html>','')
s=re.sub(r'<noscript>.*?</noscript>','',s)
s=s.replace('<style>\n[hidden]{display:none!important}html{color-scheme:light}body{margin:0;font:14px system-ui,sans-serif}img{max-width:100%}\n','<style>\n',1)
open('artifact.html','w').write(s)
