# Build 92 — Opening doors and walking directions

Reception now has two steel leaves that swing on actual hinges when the player approaches from either side. Cell 07 has an assigned, opening door rather than a slab permanently parked beside the entrance. Door status lights change with clearance and approach, and restrained hinge/latch sounds accompany nearby opening and closing. Other cells remain secured; Tool Control, release and skill gates retain their progression locks.

Door motion uses a frame-rate independent update and separate opening/closing distances. The threshold stays open while a player passes or pauses. Collision boxes follow the moving leaves; closed panels are solid. Dynamic leaves are excluded from static batching. Reduced motion snaps to the same safe open state. Doors freeze with the simulation on pause.

Amber floor chevrons and a small walking-direction plate lead to the next real corner or doorway, from the transport aisle and stairs through Reception, Tool Control, Cell 07 and the first mining/selling assignment. After the first shift, selected Tab destinations use the same physical routes. The arrow turns with the view; distance and checkpoint name remain visible. Indicators hide at an actionable intake counter, during mining/combat and outside gameplay. They use one five-instance mesh with depth testing rather than lights or a post-processing effect.

## Validation

- 238 syntax/gameplay/presentation checks pass, including door hysteresis, frame-rate equivalence, reduced motion, clearance, real walking collision and two-sided passage through Reception and Cell 07.
- All existing first-shift and skill-wing routes still fit the real player collision body. The new arrival targets follow the bus exit, steps, portico and physical Reception doorway.
- Actual in-app browser on an isolated localhost origin: left the transport by its stairs, followed the new plate, watched Reception swing open, walked through it, logged belongings, checked in, collected the pickaxe and followed the release passage to Cell 07.
- Walked through Cell 07 from the inspection aisle, registered the cell, paused and reloaded. The registered pickaxe and labour clearance persisted. Walked out through its operating door after reload.
- Continued to Deepwell, mined three blocks for 18 resources, followed the exit ramp, reached Pay Office and sold for 36 CR. Pausing and reloading preserved all 36 credits and the registered tool. Production saves were not reset.
- Final browser screenshot verifies the guide and controls have separate space. Added no lights or external assets. Hardware frame-rate and independent audio listening were not benchmarked.
