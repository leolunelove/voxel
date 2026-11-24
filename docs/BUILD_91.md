# Build 91 — Reception and tool issue reach

Reception now accepts interactions along its accessible counter frontage. Property logging and officer registration use the same front-of-counter standing area, so players can complete the two steps in place. Tool Control accepts the clear approach and walkable side of its issue counter, including positions that the old 1.85-unit point radius missed.

A shared intakeInteraction result supplies both the E handler and visible action prompt. Ready states use a stable brass-edged panel and larger E key. Outside reach, the panel and attempted interaction explain where to approach rather than repeating a generic objective. There is no crosshair or facing requirement. Bounds exclude the staff side, property cage, roof and the far side of the Tool Issue doorway. The processing order and one-time stage advancement remain enforced. Officer captions stay in-world; the property officer now correctly tells the player to remain at the counter.

## Validation

- 232 syntax/gameplay/presentation checks pass, including new frontage positions, sequential registration from the same position, approach and overshoot at Tool Control, wrong side/height/closed-door rejection and saved stage advancement.
- Physical-world tests verify the widened areas contain player-width standing positions at the actual Reception and Tool Control counters.
- In-app browser with an isolated fresh character: started at (5.8, 2.65, 56.8), outside the old officer hotspot; saw E / Log belongings, pressed once, saw E / Check in with duty officer, and registered from the exact same position.
- Walked through the unlocked Tool Issue door; at (9.35, 2.65, 49.35), the clear E / Collect assigned pickaxe prompt appeared. Pressing E advanced to the Cell 07 assignment, registered Worn Iron and opened the release gate. Pause remained functional.
- Reload preserved the registered Worn Iron and Cell 07 assignment. Continued through the release passage, registered Cell 07 and mined a first haul of 10 resources worth 32 CR with the issued pickaxe. Walked back to Pay Office, sold the haul for 32 CR, paused and reloaded; the 32 credits, registered tool and labour clearance persisted.
- The checkpoint changes only the isolated test spawn. It is excluded from deployment; production character progress was not reset.
