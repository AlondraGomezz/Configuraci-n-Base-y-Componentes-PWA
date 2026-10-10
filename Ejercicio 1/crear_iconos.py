
from pathlib import Path
import tkinter as tk
from tkinter import messagebox
from PIL import Image, ImageDraw

carpeta = Path(__file__).parent / "icons"
carpeta.mkdir(exist_ok=True)

def crear_icono(tamano):
    imagen = Image.new("RGB", (tamano, tamano), "#6F4E37")
    dibujo = ImageDraw.Draw(imagen)

    escala = tamano / 512

    # Vapor de la taza
    for x in (210, 256, 302):
        puntos = [
            (x * escala, 185 * escala),
            ((x - 13) * escala, 155 * escala),
            ((x + 13) * escala, 130 * escala),
            (x * escala, 105 * escala),
        ]
        dibujo.line(
            puntos,
            fill="#F7F1E8",
            width=max(2, int(9 * escala)),
            joint="curve"
        )

    # Plato
    dibujo.ellipse(
        (105 * escala, 340 * escala,
         407 * escala, 390 * escala),
        fill="#D6B38A"
    )

    # Cuerpo de la taza
    dibujo.rounded_rectangle(
        (145 * escala, 205 * escala,
         340 * escala, 350 * escala),
        radius=int(22 * escala),
        fill="#F7F1E8"
    )

    # Asa
    dibujo.arc(
        (305 * escala, 225 * escala,
         390 * escala, 320 * escala),
        start=-90,
        end=90,
        fill="#F7F1E8",
        width=max(3, int(19 * escala))
    )

    # Superficie del café
    dibujo.ellipse(
        (160 * escala, 215 * escala,
         325 * escala, 250 * escala),
        fill="#A47149"
    )

    ruta = carpeta / f"icon-{tamano}.png"
    imagen.save(ruta, format="PNG")
    print(f"Creado: {ruta}")

crear_icono(192)
crear_icono(512)

ventana = tk.Tk()
ventana.withdraw()
messagebox.showinfo(
    "Iconos creados",
    "¡Listo! Se crearon los dos iconos PNG en la carpeta icons."
)
ventana.destroy()