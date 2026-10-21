# Distinct mines and contact-led mining

## Environment direction

Each rank now replaces its architecture, floor footprint, lighting, atmosphere and obstacles, rather than recoloring the same chamber. All use the Block 07 workers' network, common return-gate language, and existing permit/save rules.

| Mine | Layout and silhouette | Light and atmosphere |
|---|---|---|
| Deepwell | Rectangular prison-yard pit, perimeter walkway, masonry enclosure, timber watchposts and open sky | Daylight, warm watchpost lamps, drifting dust |
| Ironworks | Twin pits divided by a walkable inspection gantry, overhead steel supports, crane and furnace bank | Cool steel ambient light against warm furnace pools, low foundry rumble |
| Gilded Fault | Clipped octagonal excavation, raised outer gallery, radial vault ribs, sealed treasury door and crystal clusters | Blue crystal lights and warm gold highlights, quieter filtered air |
| Ember Hollow | Split irregular seams, raised rear terraces, non-minable basalt spine, staggered cavern walls and protected heated conduits | Ember-colored pools, purple-black ambient fill, rising motes and deeper rumble |

Layout footprints, bounds, bottom depth and spawn positions live in layouts.js. Architecture and lights live in environment.js. World generation and collision use the same column-top function. Decorations with blocking collision use explicit world-space boxes. Mines retain mined-out terrain collision and one-block jumpable height changes. R uses the current layout's gate. Travel and reload also spawn at that gate. Heated conduits are decorative; this update adds no damage mechanic.

Each layout has a different ore-field shape and block count. The renderer hides enclosed ore blocks, revealing neighbors when a block is removed. Non-ore floor tiles and motes use instancing. Old architecture, textures, geometry, and materials are disposed on regeneration/travel. These optimizations do not constitute a measured hardware performance guarantee.

## Pickaxe contact

The previous coarse-box head is replaced with a thinner, continuous stepped forged profile, cutting tips, grained haft, wraps and tier-specific fittings. No hand or sleeve is used. The leading tip drives the contact animation rather than a sideways sweep.

The strike has wind-up, acceleration, a compact contact pose, follow-through and recovery. At contact, the viewmodel pivot is solved so its leading tip projects onto the current aimed surface point. This is a first-person viewmodel alignment, not a physically simulated arm stretched across the full interaction range. The rig uses a separate lit camera and never rotates, locks or slows the gameplay camera. The player retains turning, walking, sprinting and jumping. Reduced motion scales the motion down.

Mining damage still accumulates against the current block; a block can now finish breaking only on a strike contact. Impact sound, contact chips, final break and ore release follow the same contact event. Nominal power remains data-driven; exact break times are quantized to strike cadence. The forge no longer claims an exact percentage reduction in real break time. Changing target or releasing still cancels partial mining progress.

## Reference review

Reviewed portions of these clips through browser playback and sampled frames, without downloading/copying their assets:

- [These Minecraft Animations Feel So Natural — Punchy Minecraft Mod](https://www.youtube.com/shorts/r2TqgNgzJbY): first-person presentation, compact anticipation and recovery. The sampled section also shows axe motion, so it was not treated as a precise pickaxe rig specification.
- [Mining Ores On A Fortune III Pickaxe](https://www.youtube.com/shorts/hXpfTk0gwl8): stylized tool/ore presentation; an animation reference, not a gameplay timing measurement.
- [Prison Mine Showcase — SpecificGame](https://www.youtube.com/watch?v=NlMwWYA0Fc8): masonry enclosure, perimeter traversal and timber detailing around an excavation. Voxel's four layouts are original compositions.

No claim of exact Minecraft reproduction or objectively perfect animation is made. The next useful check is the player's assessment of contact weight and repeated mining while moving.
