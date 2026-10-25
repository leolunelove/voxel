# Voxel 68 - Forward tool contact

Pickaxe and axe geometry now use a vertical shaft and a head built along the forward axis. Work tools have a smaller head, longer grip entering from the lower-right corner, and restrained roll. Tool scale is 0.78 instead of 1.08. Viewmodel lighting preserves metal face contrast.

The working point follows an explicit lift, accelerated downward/forward strike, brief contact hold, upward/backward rebound and quiet recovery. The grip is solved behind that point. This removes the old dip/float caused by blending a grip correction. Mining rules, rewards, camera and locomotion remain independent of presentation.

Validation: 120 tests pass; static asset closure and syntax pass. Local Chrome: walked to mine, collected diamond, jumped, opened Exchange, entered timber farm and broke a trunk block. A six-pose study uses the actual models and pose solver at tests/tool-preview.html. Automated browser input and visual inspection do not replace the player's mouse feel or audio assessment.
