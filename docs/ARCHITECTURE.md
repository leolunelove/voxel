Current environment/contact extension: layouts.js owns footprint and spawn data, environment.js builds disposable architecture and lights, world.js uses the same footprint for rendering/collision, and contactPivot in pickaxe.js aligns the leading tip with the aimed surface in viewmodel space. Block completion is gated by swing contact. See ENVIRONMENTS_AND_CONTACT.md.

# Architecture and approved loop

Current progression and UI contract: see PROGRESSION.md. Four permit-gated mines, eight ores, six pickaxes and ten satchel expansions are data-driven in rules.js. Save schema 2 migrates legacy progress. HUD separates lightweight live updates from Exchange rendering; hidden menu lists are not regenerated on each pickup. World generation replaces the active field and updates mine atmosphere/signage. Pickaxe contact now drives forward/down with restrained lateral motion. The current UI is fully rebuilt around permit, forge and cargo sections. Remaining older notes below are foundation history; localization and TypeScript/Vite remain pending.

Player fantasy: become an increasingly capable miner through quiet repetition. Mine → fill satchel → sell → improve equipment → mine faster. Challenge comes from resource toughness and upgrade costs; no time pressure. Mining feel is the primary acceptance gate.

## Boundaries

- src/game/rules.js: pure inventory, selling, upgrade, save validation, and mining calculations. No browser dependencies.
- src/game/world.js: voxel occupancy and visual creation. Grid occupancy decides collision; render meshes do not decide player movement.
- src/game/player.js: fixed-step movement, per-axis collision and vertically subdivided movement. Player shape is an upright box; solid grid is broad phase. No rigidbody library required for this slice.
- src/engine/input.js: input state and pointer lock; clear held inputs on blur, unlock, and visibility loss.
- src/engine/feedback.js: procedural pickaxe, cracks, pooled materials/geometries and disposable particle objects; reads results only.
- src/engine/audio.js: synthesized impact/break/reward sounds, unlocked by a gesture. No media downloads.
- src/ui/hud.js: HUD and menu presentation. Button callbacks request mutations from main; UI never edits inventory directly.
- src/main.js: composition and central loop. Fixed 120 Hz locomotion, bounded elapsed time, then mining, feedback, and rendering. Avoid adding entire systems here.

Mining targets the center camera ray, limited to five units. A target switch or release cancels partial damage. Each successful break collects once then removes the authoritative block. Full inventory stops mining before removal. Block meshes are axis aligned and fixed. No enemies, hurtboxes, attacks, ragdolls, or networking are required.

Movement uses WASD, jump, mouse look, and procedural pickaxe motion. The pickaxe model is authored in src/engine/pickaxe.js from stepped geometry with tier-specific metal, wraps, bindings, glove, and sleeve. A separate, lit viewmodel render pass keeps its perspective stable and prevents world clipping. Framing adapts to aspect ratio. The swing follows anticipation, a quick contact, follow-through, and slower recovery; continuous mining loops it, release completes recovery. Tier changes lower and re-equip the tool. Impact sounds and surface chips follow the swing contact; block-break feedback follows the gameplay result. Reduced motion scales the swing down and reduces debris. No camera shake is required.

Pause and office clear mining and movement. Resume requires mouse capture. Buttons have focus, hover, pressed and disabled states. HTML is a game HUD overlay, separate from the WebGL renderer. Desktop keyboard/mouse are the supported inputs; mobile and controller are not implemented.

## Performance and automation

The slice has 1,050 individually rendered blocks with shared geometry/materials. This deliberately favors clarity for the first test; chunked visible-face meshing should precede bigger mines. Pixel ratio capped at 1.75, no shadows, shared particle assets. Target a stable 60 FPS on the user's desktop, measure before claiming it. No current device performance guarantee.

window.deepwellDebug() is read-only semantic inspection (state, mode, block count, player position, draw calls). No remotely accessible mutation endpoint. Pure tests cover frame-rate mining, inventory boundaries, purchases, and malformed saves. Browser checks must cover continuous digging, full bag, upgrades, reload, collision, pause, focus, and mine refills. Automated checks do not establish whether mining feels satisfying.

## Remaining foundation work

TypeScript/Vite tooling; stable translation keys; chunk meshes; stricter menu focus trapping; authored audio/materials; persistent settings; targeted device performance profiling; full locomotion/corner collision suite. Step 3 will explicitly decide backend requirements before accounts or trusted online progression. Local storage is player-editable and unsuitable for a competitive economy. Analytics and remote automation are not yet implemented.
