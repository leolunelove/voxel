# Build 62 — Bow space and release

The visible arrow and projectile now use shared bow-space geometry. The arrow rests above the grip, pulls back along its aiming axis, and extends toward the crosshair rather than pointing parallel to an offset camera ray. Its screen-space muzzle is mapped from the 48-degree item camera to the game camera. Launch converges on the exact reticle ray, compensates gravity, retains tier speed and respects foreground walls. There is no enemy aim lock.

The draw raises a stable bow on the left, exposes the shaft and feathers, and bends attached limbs and two three-dimensional string cords. Release snaps the arrow out in 26ms, followed by short string oscillation and restrained forward recoil. Wrapped grip and arrow shelf add depth. World arrows have heads and feathers. Draw/release sound scales with charge, wall impacts have a separate thunk, and a two-degree focus zoom eases in without changing mouse sensitivity. Reduced motion keeps the draw readable.

114 checks cover rig attachment, reticle convergence, visible/real muzzle alignment at different FOV/pitch/yaw, framing on narrow/wide views, ballistic accuracy, jumping-height bullseyes and foreground occlusion, alongside existing progression and combat tests.
