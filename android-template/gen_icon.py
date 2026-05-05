import struct, zlib, sys

def make_png(size, color):
    def chunk(name, data):
        c = zlib.crc32(name + data) & 0xffffffff
        return struct.pack('>I', len(data)) + name + data + struct.pack('>I', c)
    ihdr = struct.pack('>IIBBBBB', size, size, 8, 2, 0, 0, 0)
    raw = b''
    for _ in range(size):
        row = b'\x00'
        for _ in range(size):
            row += bytes(color)
        raw += row
    idat = zlib.compress(raw)
    return b'\x89PNG\r\n\x1a\n' + chunk(b'IHDR', ihdr) + chunk(b'IDAT', idat) + chunk(b'IEND', b'')

output = sys.argv[1] if len(sys.argv) > 1 else 'icon.png'
open(output, 'wb').write(make_png(192, [102, 126, 234]))
print(f'Generated {output}')
