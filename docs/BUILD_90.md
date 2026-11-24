# Build 90 — Directions, safe refills and the Foundry identity

Navigation follows ordered physical portals rather than broad coordinate conditions. First-shift guidance no longer sends an off-centre player inside Deepwell back to the yard. The Tab skill book includes destination buttons for Deepwell, Pay Office, Cell 07 and the unlocked labour wings. Directions follow the correct doorways, permanent ramp and wing doglegs, including returns from other activities. A clearer Cell 07 aisle sign identifies the assigned doorway. No movement, tool contact, mining power or reward tuning changed.

Mine elapsed time begins with excavation. A depleted or aged seam starts a warning, then waits while a player remains in Deepwell. Work can continue through the pending state. The refresh runs after the player walks out, preserving their position, haul, gear and progression. The automatic reset handler no longer calls player.home(). Manual fresh-seam requests made from the mine queue the same safe reset. Pausing does not advance reset timing.

The approved Foundry wordmark is installed in the menu; its orange-centred X is used in the HUD and favicon. Transparent PNG masters are retained locally in art-direction; small WebP runtime versions add approximately 55 KB total.

## Validation

- Full syntax and gameplay suite includes real player-width route traversal through Cell 07, mine ramp, Pay Office and all three skill wings, in both outward and return journeys. Added cases cover the reported off-centre Deepwell arrow, overshot turns, pausing, untouched-seam age and repeated occupied-refill deferral.
- Real-world traversal checks caught and corrected a ramp railing corner, a yard signpost collision and Pay Office wall/approach errors before release.
- In-app browser, isolated local checkpoint: selected Deepwell directions in Tab, walked to the mine, held to break three blocks and collected 14 resources worth 52 CR. The checkpoint advances the seam age after the first break solely to exercise the normal reset rules quickly.
- Countdown reached zero with 81 blocks remaining, three excavated and waiting=true. The character stayed at the exact position (2.99, 2.65, -11.83); the removed blocks remained absent and the haul stayed intact.
- Walked out normally: reset restored all 84 blocks while the player was at (6.58, 2.65, 6.20), without teleporting to the spawn. Continued to Pay Office, sold the haul, paused and reloaded; 202 credits persisted (150 test credits plus 52 earned).
- Inspected the new menu wordmark visually. The checkpoint, accelerated test age and debug outputs are excluded from the deployed game. Production progress was not reset.

Chrome automation was unavailable this turn; functional browser checks used the in-app browser. Automated traversal covers the full new direction network; not every wing was manually walked again. This was not a hardware frame-time or independent audio test.
