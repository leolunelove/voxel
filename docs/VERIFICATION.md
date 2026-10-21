# Weapon progression and forward bow / build 44

Four sword/bow tiers with skill gates1/2/4/7, prices0/90/340/1100, material/shape differences and saved equipment validated against skill XP. Sword multipliers1/1.4/2/2.85. Bow draw times.8/.64/.50/.38s; full-draw speeds42/54/68/84; full damage26/38/56/80. Q selects sword/bow in hunts and dungeon runs. Real swept arrows damage enemies, award Archery XP on ranged kills, obey walls and retain risky loot rules.

Bow geometry rebuilt in Y/Z, held without sideways yaw/roll. Nocked-arrow axis projects through the reticle at every draw; string pulls backward, limbs flex, nock clears briefly on release and tool recoils without moving the gameplay camera. All68 tests pass including every weapon gate, charges, persistence, stronger damage, real projectiles blocked by walls, narrow framing and forward aim. Browser: forged Tempered Blade for90 (263->173), damage28->39; trained Archery to30XP/level2, unlocked and forged Steel Recurve for90 (173->83), visibly changed metal parts and faster draw; killed Ironback with ranged shots, gained Archery XP and banked34 loot (83->117). No build43 runtime errors observed. Final build44 adds tier-matched hotbar colors and damage/draw stats; reload confirmed Tempered Blade and Steel Recurve equipped in the Tab skill book, with no build44 runtime errors.

# Archery, generated dungeons and skill book / build 41

East gate connects to permanent archery room; west gate connects to dungeon lobby. Bow draws on held LMB and fires swept-collision arrows on release; real target hit awards2/4/6XP. Browser: full-draw bullseye earned6 Archery XP and survived reload.

E at lobby rune generates a new4/5-room connected layout. Separate dungeon collision and encounter bounds prevent healing inside, cross-room attacks and monster respawns. Clear all enemies and E at last seal awards Dungeoneering XP once, banks risky monster loot and restores work-yard position. Browser: route EAST/SOUTH/EAST traversed and all3 enemies defeated; exit awarded160 Dungeoneering XP and70credits (193->263). Second entry generated WEST/NORTH/WEST; R abandoned with unchanged160XP. No build40 runtime errors captured. Tests cover150 seeds with connected floors, walkable routes/gates, collisions, real projectiles, no tap/miss XP and one-time completion.

Tab opens a paused skill book containing5 skill cards, progress bars, next-level XP and total level. Tab/Escape/button resumes; menu/shop Tab navigation stays intact. Browser verified readable layout at677x752, real saved XP in each card, toggle/resume and HP100 remaining unchanged while movement keys were held with the book open in combat. All62 tests pass. Existing custom-domain publication remains blocked from the earlier approval-policy rejection; this build is local and prepared in dist.

# Combat feel / build 38

Sword has its own diagonal slash, faster contact stroke, held contact, recoil and .50-second cadence. Confirmed hits pause only the viewmodel for35ms and show a brief hit marker; movement and world simulation continue. Separate procedural swing/strike/hurt sounds. Monsters have arms, raised-arm windup, amber ground ring and incoming warning HUD, committed strike/recovery, hit flash, stagger, interrupted windup, bounded knockback and .45-second falling defeat. Ironbacks resist knockback more than crawlers. Dead bodies cannot be hit or reward twice. Reduced motion removes impact flashes and extra animation.

All55 tests pass, including full sword framing across101 phases/narrow+wide views, real tip contact, interrupt/knockback/pause/reset and defeat animation. Browser build37: repeated sword hits killed Ironback, awarded34 risky credits, then walking out banked34 (159->193). No build37 runtime errors captured. Physical mouse feel and audio balance still require user judgement.

# Hunting and two-block trees / build 36

Added Old Exercise Yard south of the compact yard through an open arch. Three voxel monsters, two types, 100 HP, telegraphed attacks, sword contact, attack XP/levels, safe-zone healing and respawn. Risky monster credits bank once only by walking out; defeat, R retreat or reload forfeits unbanked loot. Browser: Ironback kill +34 at risk; walked out credits125->159. Second kill at Attack level2 had34 at risk; knockout returned home with100HP,0risk,cargo66 preserved. No build35 runtime errors observed; a build33 environment-audio index error was fixed before final checks.

Trees: separate trunk targets; first block visibly disappears and awards no timber; second block fells remainder and awards full bundle. No tree fill meter. Browser cargo54->54 after first, then66 after second. Automated52 checks cover combat loss/banking/reload/dodging/pause/respawn/gate and updated tree behavior. Subjective combat balance and physical mouse feel still need player feedback.

# 3D axe / build 31

Solid square shaft, four grip bands, metal socket, broad blade with decreasing depth toward the cutting edge. Negative held yaw and steeper forward pitch; real edge contact point. Browser felling collected 12 timber (cargo 42 to 54). All 47 automated checks pass.

Publishing: registered appgprj_6ad74230dca881918e217edd3fc34cb4, audience public per user. Source workflow upload was rejected by automatic approval policy at write_stdin before it received credentials; no saved/deployed version exists. No DNS changed. Prepared static dist and Voxel-web-build-31.zip. Reuse the persisted .openai/hosting.json identity on resume; obtain fresh short-lived credentials in memory and follow the Sites source helper.

# Forward/down strike / build 30

Windup ends at .16 instead of .24; contact at .30 instead of .39 (23% earlier within the same cycle). Strike pitch reaches -.51 radians total, with more forward travel. Contact dwell ends .34; recoil releases contact assistance by .48. Sound, chips and mining contact use the earlier strike frame. Both tool tips remain aligned at contact. Browser held mining collected ore. All 47 checks pass.

# Solid pickaxe / build 29

Pickaxe replaced with volumetric square shaft, grip bands, socket and a stepped head tapered in X/Y/Z. Negative held yaw points the working tip away from the camera; contact framing uses the actual 3D tip. Axe retains its previous model. Browser mining collected new ore successfully. All 47 checks pass, including forward tip direction and framing of every tier.

# Pickaxe refinement / build 28

Narrower stepped pick head; lower resting pose; accelerating downstroke, 4% cycle contact dwell, upward/backward recoil, and quiet final 20% of cycle. Contact correction releases by phase .60. Original movement and gameplay camera remain independent. Read-only six-pose study: tests/tool-preview.html. All 46 automated tests pass, including narrow/wide framing across tiers, contact alignment, dwell and recoil. Human judgement of mouse feel and audio remains subjective.

## Compact yard and voxel UI / Build 26
45 automated tests pass. The active runtime is CampWorld, one expanding mine and one expanding forest. See COMPACT_YARD.md for progression, migration and mechanical checks. Older four-wing tests below cover retained legacy modules, not additional destinations in the current game.

Browser checked mining and magnetic pickups, selling, buying the six-tree forest expansion, forging the steel axe, automatic axe selection, whole-tree felling, timber collection and retained cargo/gear/expansion after reload. A read-only geometry review showed all three plot stages. The latest voxel UI was inspected in the 677 by 752 game viewport: bundled pixel font, menu, tool hotbar, cargo, plot screen and forge. No captured browser console errors, including font loading.

Pickaxe and axe silhouette/framing tests cover their actual visible vertices through 21 swing phases at three aspect ratios; both contact points remain close to the reticle. The supplied pickaxe image guided the final silhouette. Human play-feel, audio listening, long-session economy and hardware performance remain manual validation boundaries.

## Connected prison / Build 19
36 automated tests pass. New integration checks construct the full prison geometry and verify walking routes from spawn to every wing, locked mine/timber access including jump-height attempts, gate lift and reload entitlement, isolated mining/refill, old eight-slot save migration, timber sales/regrowth, and walking down/up permanent stairs in all four mines without jumping.

Browser checked the central yard, walking through Deepwell's open gate, descending stairs, mining and magnetic ore arrival, walking into the level 2 timber yard, harvesting a trunk for three timber drops, opening Exchange, selling the combined haul, and save persistence after reload. No captured browser console errors during that run. Gate lift and all four unlocked routes are geometry/rules integration checks, not a manual playthrough of the full economy. Subjective mining/audio comfort and hardware performance remain user playtesting boundaries.

# Prototype verification

## Distinct environments and contact-led pickaxe pass

29 automated tests pass. Added shape/footprint differences, correct regeneration counts without duplicate ore fields, safe gate data for all layouts, jumping onto Ember Hollow's raised terrace, aimed-tip projection across camera pitches/yaws/aspect ratios without camera mutation, and delaying final block removal until a strike contact. Existing movement, save, economy, rank, magnet and gear tests remain passing. All six pickaxe tiers remain framed horizontally at rest.

All four environments were visually inspected through tests/environment-preview.html, a separate inspector that never reads or writes the player's save. Ironworks gameplay was checked with ordinary mining and simultaneous forward movement plus mining; no console errors were observed. Subjective contact/audio quality and hardware frame pacing still need user playtesting. Upper ranks were inspected without buying/spending the player's saved resources. Reference playback and implementation limits are recorded in ENVIRONMENTS_AND_CONTACT.md.

## Mine ranks, UI overhaul, chopping and drop bundles

25 automated tests pass. Coverage now includes the full four-permit/six-tool chain, rank-gated purchases, locked-mine rejection, all mine fields generating only allowed resources, travel replacing old fields without duplicate block meshes, monotonic expected bundle value, legacy save migration, v2 validation, and capacity-safe pending bundles. Swing tests verify forward contact with minimal lateral translation and all six tool models fitting at rest. Existing movement, magnet, economy, and frame-rate tests remain passing.

Live browser: rebuilt start menu and HUD; permit directory; mine/forge/cargo section navigation; common-resource bundles; repeated mining/selling to afford Rank B; permit purchase charged 450 CR once; travel to Ironworks; iron/copper/silver collection and inventory values; saved Rank B, Ironworks and cargo after reload. Forge and cargo layouts inspected at the current narrow viewport. Rank C/D are covered in rule and mine-generation tests, not a manual grind through their full costs. Long-session economy balance and subjective chopping/audio feel require player feedback. No production backend or deployment was added.

All sections below describe earlier builds and their then-current limitations.

## Voxel movement and pickup pass

16 automated tests pass. Added real one-block crate clearance, no repeated jump while held, pre-landing jump buffer, acceleration/friction/diagonal speed, magnetic arrival exactly once, and pending-pickup save safety. Existing rule, collision, and pickaxe framing tests still pass. Live browser checked Voxel branding, no hand/sleeve, Space jump, mining with delayed inventory arrivals, and no console errors. Native external-browser mouse capture and subjective movement comfort still need user playtesting. Current lore/style is in VOXEL_STYLE.md. Prior verification below is historical.

## Mining polish pass

Eleven automated tests pass, including swing continuity and actual model-vertex framing for all three tiers on narrow and wide displays. Rechecked inventory, save validation, frame-rate mining, costs, collision and safe return. Live browser verification covered repeated mining/selling/refill cycles, purchasing tempered steel with earned coins, the new steel model and faster mining, retained equipment after navigation/reload, and pause/resume. Worn iron and steel were inspected in gameplay. Jade geometry/framing is tested but its purchase was not manually played through. Audio synthesis ran during mining/purchase without observed application failure; subjective sound quality needs the user's listening test. No external-browser pointer-lock or hardware performance measurements were added.

Pickaxe polish: stepped blade with curved tips, raised bindings and rivets, glove/sleeve, tier-specific detailing, fixed-perspective lighting, wind-up/contact/recovery animation, movement bob, re-equip motion, contact-aligned impact sounds, material-specific break sounds, progressive branching cracks, surface chips, and bounded break debris. All sounds are original procedural synthesis; no Minecraft assets were copied.

## Initial prototype checks

Nine automated tests passed using the bundled Node runtime: inventory capacity, duplicate sale prevention, upgrade costs, malformed saves, mining timing at 30/60/120 FPS, stronger-pick break time, target cancellation, ground/bedrock collision, voxel wall collision, and safe return (some grouped into shared tests).

Live in-app browser checks: scene and HUD load; original pointer-lock attempt is blocked by the embedded browser; drag-to-look fallback enters gameplay; holding left mouse breaks successive blocks (three blocks awarded a 16-coin haul in the tested path); office opens with E; selling clears bag, adds 16 coins, disables repeat sale; refresh retains the balance and equipment state. Mining feels remain subject to human playtesting. Native pointer capture in an external browser, actual audio listening, hardware frame rate, full-bag UI, and a full purchased-upgrade run have not been manually verified.

This is a local prototype. No production deployment was attempted. Semantic remote actions, internationalization, TypeScript/Vite, chunk meshing, and additional mines remain pending. Existing shared-geometry block rendering suits this small first experiment but needs measurement before expansion.
