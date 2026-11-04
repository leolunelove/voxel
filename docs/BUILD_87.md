# Build 87 — Sword contact and Containment

Melee now drives a readable diagonal strike through the reticle, holds briefly at contact, follows through and returns to the right shoulder. A successful strike pauses only the held sword for 42ms (60ms on a kill), with backward recoil. The gameplay camera and player physics remain independent. Changing tools resets the previous swing so an axe cycle cannot become an immediate sword hit.

The blade has a small surface-tested sweep around the crosshair. Centre contact has priority; peripheral samples must still intersect an actual enemy mesh within 3.05 units and pass the world obstruction check. The viewmodel follows that contact with bounded correction. Hits create short, directional steel fragments and layered transient/body/armour audio. Damage appears briefly beside the reticle. The combat arrival banner is compact, the unrelated mining order is hidden during combat, and target text sits below the fighting view.

Regular monsters flinch, flash, recoil along the hit direction and lose their current windup. Ironbacks resist knockback; bosses retain their attack windups. Finishing blows kick back into a weighted collapse before shrinking away. The existing magnetic loot tokens remain presentation only. A short prison-styled defeat notice reports the existing Attack XP and credits at risk; it awards nothing.

## Current-map integration

The foundry prison had `inHunt` permanently false and an empty spawn list. Reconnected combat through a new compact Containment hall off the courtyard's south-east gate. Access opens after 60 blocks mined (Prison Level 3); legacy Attack progress also preserves access. A short roofed dogleg reveals the barred holding hall, using the current prison materials and lighting. Nearby enemies activate before distant threats. Walking back into the safe passage still banks loot exactly once. Mining, intake, Cell 07 and Timber Detail routes remain unchanged.

Sword and bow hotbar slots and their forge cards return once combat clearance is unlocked. The unavailable dungeon shield card stays hidden in this campus. No dungeon or archery wing has been added in this release.

## Validation

- All 213 syntax/rules/presentation checks pass via `scripts/check.mjs`.
- Geometry tests cover narrow/wide sword framing, exact reticle contact and a camera moving, turning and changing height independently of the swing.
- Contact tests cover 30/144Hz cadence, tool switching, real surfaces, reach, obstruction, regular/boss interruption, bounded effects, reduced motion and one-time rewards.
- Route tests cover the locked/open checkpoint, the complete dogleg in both directions, player-sized doorways and all three monster spawn positions.
- Chrome with an isolated local character: walked from the yard through the gate and passage; killed a crawler with the starter sword (12 Attack XP, 18 CR at risk); paused; returned through the doorway to bank; reloaded and confirmed 1,018 credits, 12 XP, one kill and zero risky loot.
- Continued to Deepwell, descended the permanent ramp and mined 12 slate drops worth 24 CR. Opened the forge and checked the visible, level-gated sword upgrade.
- The initial browser run exposed a doorway mob and ended in defeat; reduced distant enemy activation before the successful run.

A separate local checkpoint fixture was used for the final player-height sword/HUD inspection and another successful kill. It changes only the local spawn point, not encounter or reward rules, and is excluded from the deployed build.

Browser automation had variable input/observation latency. This is a functional and visual contact pass, not a hardware frame-time benchmark or an independent audio audition. Boss interrupt resistance and upgraded sword behavior are covered by tests; a full dungeon boss run was not browser-tested.
