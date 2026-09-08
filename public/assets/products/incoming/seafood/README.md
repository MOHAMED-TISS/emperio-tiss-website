# Seafood image intake

Add seafood catalogue images to this folder.

## Naming

Use the existing product ID as the filename base:

- `dorada.jpg`
- `dorada-2.jpg`
- `dorada-3.jpg`
- `lubina.jpg`
- `mero-amarillo.jpg`

The automatic sync groups numbered variants (`-2`, `-3`, etc.) with the same product.

Product IDs currently used by the fish catalogue include:
`dorada`, `lubina`, `merluza-pijota`, `mujol`, `rape`, `san-pedro`, `mero-amarillo`, `pargo`, `denton`, `sama`, `sargo`, `rascacio`, `caballa`, `salmonete`, `atun`, `salmon`, `pez-limon`, `boqueron`, `pez-sable`, `pez-espada`.

## Image standard

For the catalogue, use a clean product photograph with the subject clearly visible and enough surrounding space for the existing 4:3 catalogue frame. JPG, JPEG, PNG and WebP are accepted.

## Automatic update

When an image is added, renamed or removed in this folder, GitHub Actions regenerates `public/assets/data/product-images.json`. The seafood catalogue then picks up the new image automatically on the next deployment.

This folder controls **images only**. Product name, scientific name, category, condition, origin, FAO zone and other technical characteristics remain controlled by the catalogue data and are not guessed from a photograph.
