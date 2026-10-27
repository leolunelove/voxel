# Voxel 72 — Draw, tension, release

The bow now uses a Minecraft-inspired hold-to-draw and release-to-fire rhythm. The starter bow takes one second to fully draw; upgrades retain faster draw times and higher full-charge damage. Short draws produce weaker, slower arrows with natural gravitational drop. Holding the draw never automatically fires. Drawing slows movement and suppresses sprinting, while turning and jumping remain available.

The rebuilt curved, solid 3D limbs sit on the right of the screen. The arrow visibly draws backwards, then launches in 26 ms with a short string recoil. The empty bow returns after release. Full draw adds a subtle tension tremor and a small pale arrow trail (disabled by reduced motion). Flying arrowheads now face the actual direction of travel; embedded arrows and monster reactions remain intact.

Right click draws when mouse capture is active. Left click remains supported. In the drag-to-look fallback, right click continues to look and left click draws. Switching weapons, leaving archery areas and pausing cancel the held draw to avoid unintended shots.

Validation: 135 automated tests passed, including charge/release, movement slowdown, input modes, arrow geometry/orientation, natural drop across 30/60/120 fps, walls and viewmodel alignment. Static build verified all module and asset references. Browser checks confirmed walking to the mine and range, mining increasing haul from 934 to 1,316 CR, opening the exchange, preserving that haul after reload, target bullseyes adding 6 Archery XP, pause and the skill panel. No browser console errors during the local check. Final bow poses were visually inspected using the real renderer in tests/bow-preview.html.

Limitations: native pointer-lock right-click behavior was unit-tested but could not be physically tested through browser automation, which used the fallback controls. No new full dungeon run or subjective audio listening was performed for this bow update.

Reference: https://www.minecraft.net/nb-no/article/taking-inventory--bow — draw/release controls, movement slowdown, charge strength, full-charge feedback and projectile gravity. Voxel uses its own geometry and code.
