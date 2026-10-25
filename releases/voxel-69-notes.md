# Voxel 69 - Block contact polish

Block cracks now grow on tool contact rather than continuously between hits. Each block has a repeatable fracture network, with the primary scar anchored to its first struck face. The overlay copies the block world transform, including parent transforms. Aim changes reset unfinished mining as before.

Hit chips and larger break fragments eject out of the face, tumble, fall under gravity and shrink away. Their colours mix rock with the ore tint; timber uses wooden chips. Reduced motion lowers particle count. These fragments never award resources; magnet pickups still own collection.

Stone, metal, crystal and timber have short material-specific impact recipes: fast transient, compact body, and a separate crumbling break tail. Audio and particle events occur at the same animation contact. Tool recoil leaves the world camera and movement free.

Validation: 125 tests pass, syntax and static asset closure pass. Browser: fracture study and camera orbit, local mine diamond collection while walking/turning/jumping, Exchange. Offline Web Audio renders eight hit/break material combinations without clipping. Audio was rendered and checked, not judged by ear. Final live verification is reported in the chat.
