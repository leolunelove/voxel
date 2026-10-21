# Voxel / compact work yard / build 26

The active game now uses CampWorld: one mine and one forest in a compact, enclosed prison yard. The former four-mine world remains unused reference code. The Exchange, tool bench, gates, benches, barred windows and guard walk retain Block 07's workers' identity.

## Progression

The mine has three permanent stages: a 6 by 8 starter seam, an 11 by 12 excavation for 260 credits, and a 15 by 16 deep excavation for 1,350 credits. Expansions widen and deepen the same pit, move its boundary fences and introduce richer ore. Existing mined holes remain open through expansion. Permanent half-block stairs provide a walking exit in every stage.

Prison level 2 is earned after 20 mined blocks and opens the forest automatically. An iron hatchet is included. The forest has three stages: three trees, six trees for 220 credits, and ten trees for 1,100 credits. A whole tree yields 9, 12 or 15 timber respectively, worth 4 credits each. Regrowth takes 24, 21 or 18 active seconds. Trees fall as a complete object; saplings visibly regrow and wait for the player to move clear before becoming solid.

The axe equips automatically at trees or inside the forest. Its four tiers provide 1, 1.8, 3 and 4.8 cutting power, costing 0, 85, 320 and 1,100 credits. Complete-tree toughness is 2.2, so stronger axes noticeably shorten the harvest. Pickaxes retain six tiers. Higher pickaxes require the appropriate mine expansion. Cargo starts at 96 fragments, increasing by 48 per satchel upgrade, so selling trips are less frequent.

Ore and full-tree yields reserve their entire capacity before harvesting. Magnetic drops and in-flight save snapshots remain intact. Expansions and forging happen through pure rules; visual animations do not award resources.

The mine warns for five active seconds before refilling when mostly depleted or after 150 active seconds with excavated blocks. Refilling returns an occupant of the pit safely to the yard. Walking between plots does not refill them. Pause stops regrowth, gate motion, mine timers, drops and harvesting.

## Tools and references

The pickaxe and axe are now thin pixel-built items with diagonal wooden handles, dark edge shading and separate stepped metal silhouettes. The supplied pickaxe image guided the final long shaft, tapering top arm, curved opposite point and rear wooden stub. The held pose uses a restrained wind-up, downward-forward contact and recoil; contact correction is bounded and never changes the gameplay camera. The shaft can naturally leave the bottom of the view while visible geometry remains horizontally framed.

Additional visual references: Minecraft's official Taking Inventory pages for Pickaxe (https://www.minecraft.net/en-us/article/taking-inventory-pickaxe) and Axe (https://www.minecraft.net/en-us/article/taking-inventory--axe). Tool geometry and palettes are authored locally; no game asset files were imported.

## Saves and verification

The menu, HUD and Exchange use the original bundled Voxel Pixel TrueType font, generated from authored bitmap glyphs by tools/build-pixel-font.py without dependencies. Pixel item icons share the same grid artwork as the 3D tools. A selected-tool hotbar, chest-style cargo slot, segmented meters and square beveled inventory panels carry the world style through gameplay and upgrades. The HUD suggests the least expensive eligible plot/tool upgrade. Mouse-capture help appears only once per page load.

Schema 4 adds mineLevel, forestLevel, axe and chopped. Previous permits map into mine expansion stages while credits, inventory, pickaxe, satchel and mined count survive. Terrain and tree edits remain session state and replenish on reload.

45 automated tests pass, including plot expansion, migration, complete-tree yields and regrowth, capacity, all-stage walking exits, auto-refill and actual visible pickaxe/axe vertices through the swing at three aspect ratios. Browser checks covered mining and pickups, selling, buying the six-tree expansion, forging the steel axe, automatic axe equipping, whole-tree felling and log collection. Reload retained the expansion, axe, balance and timber. Subjective swing/audio quality and long-session balance remain human playtesting boundaries.

The read-only tests/camp-preview.html shows all three plot stages without accessing saved gameplay.
