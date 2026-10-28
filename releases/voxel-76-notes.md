# Voxel Build 76 — Containment and Armoury Wings

Iron Hall and the Long Room are now separate prison wings beyond the starting work block. Each has a rising checkpoint portcullis, a covered corridor with two turns, a concealed room reveal, arrival title, its own route color, work lighting and return signs. Iron Hall uses rust-red containment markings and barred holding bays; the Long Room uses brass guidance, timber target bays and numbered firing lanes.

Prison Level 3 (60 mined blocks) opens Iron Hall; Level 4 (120 blocks) opens the Long Room. Level 2 / Conservatory remains 20 blocks. Existing saves with Attack or Archery XP keep access to the corresponding wing. Save schema, mining speeds, movement, combat stats, projectile physics and reward amounts are unchanged.

Rooms, enemy spawns, pursuit bounds, archery targets, colliders and HUD regions share the new coordinates. The approach corridors remain safe; leaving the arena still banks loot once. Defeat still forfeits unbanked loot. Static corridor meshes are instanced and collision walls are merged into continuous sections.

Validation: 162 automated checks passed, including threshold transitions, locked bars, round-trip routes, jumping clearance, reveal sightlines, all three target lanes with real projectile collision, legacy progress, safe-corridor healing and existing mining/dungeon/save regressions. Production build: 65 files / 2.27 MiB.

Browser QA used separate local origins for advanced and early-game saves. The 22-block save was physically blocked by both new gates and shown accurate remaining counts (38 / 98 blocks). The advanced save walked both doglegs and triggered both arrival titles. A full-draw archery target hit awarded XP. Two bow shots defeated an Ironback; walking back into the containment passage banked 34 CR, which survived reload. Mining added ore to the existing haul; selling paid 2,232 CR and the resulting 34,588 CR balance survived reload. Pause, Exchange and collision checks passed. No browser console errors were observed.

A renderer study including targets and monsters measured the archery reveal at pixel ratio 1.5: 8.61 ms mean frame interval, 9.7 ms p95, 33 draw calls and 8,662 triangles over 180 frames. This is a desktop study, not a low-end-device guarantee. Native pointer lock and a full new dungeon run were not retested. The six new integration tests plus existing dungeon regressions cover the unchanged dungeon path.
