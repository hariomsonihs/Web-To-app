import struct, zlib, os

def make_png(path, size):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    w = h = size
    raw = b''
    for y in range(h):
        raw += b'\x00'
        for x in range(w):
            cx, cy = w//2, h//2
            dx, dy = x-cx, y-cy
            if dx*dx + dy*dy < (w*0.45)**2:
                raw += bytes([102, 126, 234])
            else:
                raw += bytes([80, 100, 200])
    def chunk(t, d):
        c = zlib.crc32(t+d) & 0xffffffff
        return struct.pack('>I',len(d)) + t + d + struct.pack('>I',c)
    png = b'\x89PNG\r\n\x1a\n'
    png += chunk(b'IHDR', struct.pack('>IIBBBBB',w,h,8,2,0,0,0))
    png += chunk(b'IDAT', zlib.compress(raw,9))
    png += chunk(b'IEND', b'')
    with open(path,'wb') as f: f.write(png)
    print(f'Generated: {path}')

base = 'android-template/app/src/main/res'
sizes = {'mipmap-mdpi':48,'mipmap-hdpi':72,'mipmap-xhdpi':96,'mipmap-xxhdpi':144,'mipmap-xxxhdpi':192}
for folder, size in sizes.items():
    make_png(f'{base}/{folder}/ic_launcher.png', size)
    make_png(f'{base}/{folder}/ic_launcher_round.png', size)
print('All icons generated!')
