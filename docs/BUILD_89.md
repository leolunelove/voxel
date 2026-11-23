# Build 89 — Bow Qualification wing

A new eastern wing is connected to the compact courtyard. Clearance 4 (120 mined blocks) opens its brass checkpoint. Existing Archery XP also preserves access. A roofed dogleg passes the armoury and reveals a long shooting hall with three numbered lanes, timber baffles, backstops, issue racks, a supervision window, dedicated task lights and a marked return route. The lane depths differ: Foundation, Tracking and Qualification.

The first target is stationary. Two rail targets move laterally at distinct speeds. Arrows remain attached to the moving target for six seconds; the retained-arrow effect is capped. Hits award the existing accuracy XP plus two XP for a moving target. The source of the shot must be behind the gold firing line; walking downrange cannot farm close-range qualification points. Target movement is based on elapsed simulation time, and all coloured rings and lodged arrows follow the same carriage. Pausing stops the simulation. Bow draw, recoil, ballistic gravity, upgrade stats and monster impact behavior remain intact.

The range automatically equips the bow. Its HUD explains scoring and the firing line, reports hits beside the reticle, and hides unrelated work-upgrade hints. The existing Archery forge and save schema are reused. No map reset or character reset is required.

## Validation

- All 219 checks pass. New coverage includes clearance and legacy access, player-width collision along the entire route in both directions, masonry boundaries, all three firing positions, bounded target motion, moving rings, accuracy XP, arrows following carriages, firing-line enforcement and wall obstruction.
- Chrome with an isolated local character: hit the Foundation target; hit the moving Tracking target repeatedly (36 to 46 Archery XP); walked back through the complete dogleg into the yard; opened the forge and bought the Steel recurve for 90 credits; returned to Deepwell and mined six additional slate drops; paused successfully.
- Reload confirmed 54 Archery XP, the Steel recurve, 928 credits and 18 slate drops.
- Local checkpoint changes only spawn position and is excluded from deployment. Production progress was not reset.

Browser testing is functional and visual, not a hardware frame-time benchmark. The existing eight-light budget and static scenery batching remain in use. Moving targets add only three updated base meshes and nine rings.
