# Voxel / creative direction

Name: Voxel. Place: Block 07, the Deepwell reclamation wing. Premise: a prison mine whose workers carved out their own trading network, forge, and small freedoms. The walls belong to the company; a miner's tools and earnings belong to the miner. Freedom is the setting's aspiration, not an implemented parole/endgame mechanic.

Personality: practical, quietly defiant, human. Short workbench language and hopeful progress; no threats, forced streaks, or punitive shift timer. Slogan: Every block is a way forward. Main menu: They own the walls. You own the next swing.

Visuals: forest-charcoal metal, amber safety paint, cream lettering, monospaced labels, bold utilitarian headings, numbered signage and squared panels. Jade gear brings a small hopeful green accent. Keep the mine readable and warm rather than horror themed. HUD describes the issued tool, personal credits, next upgrade work order, and ore satchel. The shop is the workers' exchange, mine reset opens a fresh seam. Credits replace display coins without changing old save compatibility.

Movement: ground acceleration, friction, air control, 4.3 walk / 5.8 sprint speed, 7.6 jump impulse / 20 gravity (about 1.44 blocks of rise), 100 ms ledge grace and 130 ms jump buffer. Jump is press-triggered, not automatic repeated hopping. Fixed 120 Hz integration and subdivided axis collision. Solid crates near the gate provide one-block jump obstacles. The pickaxe floats without a hand or sleeve, preserving the familiar voxel-game convention.

Ore: each break creates a visible rotating fragment, with a brief outward pop followed by accelerating magnetic travel to the player. Inventory and recovery sound occur on arrival. Pending fragments reserve capacity; snapshots include reserved resources. Opening the exchange flushes pending pickups safely before a sale. Pausing freezes travel. Resources are never lost on refresh or duplicated on sale. This magnet is intentionally generous; it follows the miner through obstacles rather than requiring chase/line-of-sight checks.
