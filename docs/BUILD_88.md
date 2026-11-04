# Build 88 — Bow tension and monster contact

The visible arrow now rests on the string, pulls farther back during a full draw, and snaps forward on release. Limb flex and release recoil are stronger. A first-frame release clamp ensures a 30 or 20 Hz frame cannot skip the short visible arrow launch. The visible muzzle and world projectile still share the same projected position; arrows aim at the reticle with existing gravity, tier speed and damage.

Full-power shots deliver a longer, stronger directional flinch and knockback. Ironbacks resist the push; bosses retain windups and heavy resistance. Embedded arrows follow the actual struck limb, ring briefly at contact, and stay for up to 30 seconds, with a six-arrow cap and cleanup on death or reset. No whole-world freeze or camera kick was added; locomotion and look remain independent. Existing deliberate draw movement slowdown remains.

Bow hits share the readable damage number and finishing-hit treatment. Kills display Archery XP and loot at risk, clear stale toast messages and temporarily hide the overlapping aim label. The Containment panel now displays the equipped bow and Archery progress when appropriate. Existing charge-scaled impact audio, armour responses, sparks and magnetic loot are retained.

## Validation

- 215 automated checks pass, including draw/release geometry, arrow-to-muzzle alignment, multiple aspect ratios and upgraded bows, slow-frame release visibility, wall obstruction, embedded arrows following moving/rotating targets, capped effects, boss resistance, movement and save rules.
- Chrome, isolated local checkpoint using the real game: two full-draw shots killed a crawler at full health, produced 12 Archery XP and 18 credits at risk, and visibly left arrows lodged through the death reaction.
- Reload preserved the kill and 12 Archery XP; unbanked loot cleared as designed. A follow-up shot and jump confirmed the corrected Archery panel and independent player movement. Pause/resume worked.
- The checkpoint changes only the local spawn location and is excluded from deployment. Production character progress was not reset.

This is functional and visual browser validation, not a hardware frame-time benchmark or an independent audio audition. A full dungeon boss run was not manually replayed; its resistance is covered by automated checks.
