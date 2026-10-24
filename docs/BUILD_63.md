# Build 63 — Iron & Ember

The selected achievable art-direction mockup is now the courtyard's material and UI reference. Charcoal masonry, rust-red closed cell doors, amber fixtures, a larger timber-and-iron Deepwell portal, orange safety lanes, sparse wall patches and conduit replace the green yard palette. The existing compact plan and plot progression remain intact.

The cellblock has a usable half-block stair and solid upper gallery. New portal side walls keep the existing mine stair opening clear. A parked ore cart sits beside the approach. Both masonry passes use instancing. Sun shadows use a bounded 1024 map, refreshed four times per second; ore blocks do not cast shadows.

The HUD uses charcoal panels and amber borders with stamina bottom-left, tools centered, and haul bottom-right. Combat stats appear only in relevant areas. The center wayfinding billboard was removed so the mine silhouette stays visible. Menu and Exchange panels share the palette.

Validation: 115 checks pass, including all plot-stage routes, mine stairs, tree approaches, archery lanes, bed and side-room access, and actual movement up the new gallery stair. Browser verification on local preview: walk to mine, hold mining, ore collection, jump input, Exchange sale, pause/reload and saved credits/gear/plot tiers. No browser console errors observed. Gameplay balance and tool animation files are unchanged except cache versions. This is an in-engine interpretation of the mockup, preserving the existing map orientation, not a pixel-identical reconstruction. Low-end device and mobile performance are not benchmarked.
