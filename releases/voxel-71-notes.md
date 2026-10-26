# Voxel 71 / The training wings

The Iron Hall replaces the unfinished open combat yard with a complete high-roofed containment room: exposed steel ties, a glazed rooflight, rust-red lower walls, barred service bays, holding doors and caged amber work lamps. Its gatehouse opens directly off the cellblock passage. A marked threshold and an inward-facing sign explain where walking out banks loot.

The Long Room is a timber-lined archery hall with a finished ceiling, brass firing lines, three numbered target bays, equipment storage and warm light aimed across the targets. A timber portal and floor markers connect it to the central yard. The range HUD now shows the bow, Archery level and XP instead of the melee health/risk panel.

Both rooms use the existing physical footprints, entrances and skill triggers. New structure is instanced, and existing range/far-wall lamps are reused. Work lights stay on in daytime and brighten at night. No save schema, progression, weapon tuning, enemy stats or resource payouts changed.

Validation: 131 automated tests pass, including room ceilings, projectile clearance, jump headroom, yard routes, pursuit floor and all three firing lanes. Browser testing on the local game confirmed a target hit (+2 Archery XP), an Ironback kill (+34 CR), walking out to bank (32,270 → 32,304 credits), reload persistence, mining (haul 682 → 934 CR), jumping, pause and Exchange access. Day/night room lighting inspected in the dedicated rendering study. Live rollout verified separately after publishing.

No broad low-end hardware performance benchmark was performed.
