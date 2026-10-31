# Build 84 — A readable work block

Deepwell is relocated 22 metres east, directly across the courtyard, instead of behind the old northwest dogleg. Ore generation, canonical block identities, drop values, upgrades and permanent ramp geometry remain unchanged. Rendered ore and collision coordinates are translated together. The work chamber has solid retaining faces, a supported roof, suspended task lights and a guarded ramp.

The courtyard now has complete, human-scale frontages using reception's material palette: Deepwell north, Cellblock A through the west inspection passage, Pay Office east and processing south. The obsolete north cell exit is closed. Overlapping floor surfaces and the old courtyard foundation outside the walkable footprint are removed. Barred windows, plinths, cable runs, drains, benches, roll-call marks and actual doorway signage support the layout. Amber and pale route lines stay on traversable ground.

First-shift guidance follows real doors and landings, turns its arrow with the view and switches to the Pay Office after collecting a haul. Returning players spawn facing the new mine entrance. Saves, skills, credits, gear and timber allocations are retained.

The menu is rebuilt around the real player view with a clearer hierarchy, saved-shift information, useful controls and a guarded reset. Begin/Resume fade the interface away and hand off the same camera position, direction and FOV. Input stays gated during the brief handoff; pausing cancels it safely. Controls copy reflects the current map.

Validation: 198 main tests pass, including guided portal routes, all mine upgrades, translated ore collision/removal, permanent ramp ascent/descent, tree allocations and camera handoff/cancellation. Browser-played arrival, processing, tool issue, Cell 07, direct mine approach, mining/magnet pickups, Pay Office sale, reload, return to bed and daily summary. The test haul was 6 Slate / 12 credits / 4 Mining XP. The summary and next-day wake were verified. A local mine-view render sample recorded about 9.1 ms mean and 82 draw calls; this is a local sample, not a device-wide FPS guarantee.
