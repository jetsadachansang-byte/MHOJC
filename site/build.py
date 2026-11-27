"""Assemble the site: src/style.css + src/body.html -> index.html (standalone) and artifact.html (Claude artifact)."""
import os,hashlib,re
H=os.path.dirname(os.path.abspath(__file__))
style=open(os.path.join(H,'src/style.css'),encoding='utf-8').read()
body=open(os.path.join(H,'src/body.html'),encoding='utf-8').read()+'\n<script>\n'+open(os.path.join(H,'src/ui2.js'),encoding='utf-8').read()+'\n</script>'
fonts='''<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@500;600;700&family=IBM+Plex+Sans+Thai:wght@400;500;600&family=IBM+Plex+Mono:wght@500&display=swap">'''
def vers(b):
    def f(m):
        p=os.path.join(H,m.group(1))
        return m.group(0) if not os.path.exists(p) else f'src="{m.group(1)}?v={hashlib.md5(open(p,"rb").read()).hexdigest()[:8]}"'
    return re.sub(r'src="((?:db|media|cards)\.js|vendor/html2canvas\.min\.js)"',f,b)
body=vers(body)
title='<title>บันทึกนักล่า Outlanders</title>'
open(os.path.join(H,'artifact.html'),'w',encoding='utf-8').write(f'{title}\n<meta name="claude:viewport-fit-sides" content="cover">\n{fonts}\n{style}\n{body}')
std=style.replace('body{background:var(--bg)','body{margin:0;background:var(--bg)',1)
open(os.path.join(H,'index.html'),'w',encoding='utf-8').write(f'''<!doctype html>
<html lang="th">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="description" content="เว็บแฟนเมด Monster Hunter Outlanders ภาษาไทย: ตัวละคร ชุดเกราะ อาวุธ สกิล มอนสเตอร์ บัดดี้ และเครื่องมือจัดบิลด์">
<meta property="og:title" content="บันทึกนักล่า Outlanders">
<meta property="og:image" content="/img/banner/og-cover-1200x630.webp">
{title}
{fonts}
{std}
<style>img{{max-width:100%}}[hidden]{{display:none!important}}</style>
</head>
<body>
{body}
</body>
</html>
''')
print('built')
