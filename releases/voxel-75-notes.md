# Voxel Build 75 — Work Block and Conservatory

Block 07 is the first-shift starting area. New prisoners wake in Cell 07, follow the amber route to Deepwell, sell their first haul and upgrade their pickaxe. Existing progress remains intact.

Woodcutting now occupies a separate Conservatory wing beyond the east prison wall. Prison Level 2 (20 mined blocks) opens its checkpoint. A sheltered, lamp-lit service corridor turns twice before revealing the nursery, with planting beds, irrigation, potting furniture and a greenhouse landmark. Allotment upgrades expand within this wing. The return route stays connected to the yard.

Mining speeds, movement tuning, rewards, unlock requirements and save schema are unchanged. Forge furniture was moved clear of the cell exit. Tree bark and end-grain rendering now uses two material groups rather than six, reducing the fully expanded nursery study from 304 to 184 draw calls.

Validation: 156 automated checks passed; production build produced 63 files (2.26 MiB). A fresh-save browser playthrough covered the locked checkpoint, mining, selling, the first steel upgrade, earning Level 2, walking both corridor turns, cutting a complete tree, buying the first allotment expansion and returning home. Reload preserved credits, gear, mined count and allotment stage. No browser errors were observed. Final expanded nursery study at pixel ratio 1.5: 184 draw calls, 30,758 triangles, 8.93 ms mean frame interval, 10.0 ms p95 over 180 frames. These measurements are from this desktop, not a low-end-device guarantee. Native pointer lock and a new full dungeon run were not retested.
