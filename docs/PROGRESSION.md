# Voxel progression / first four permits

Mine → magnetic fragments → sell → improve tools and satchel → earn a permanent permit → travel to richer seams. No shift timer, tool breakage, or prestige system.

| Rank | Mine | Permit cost | Required tool | Resource mix |
|---|---|---:|---|---|
| A | The Deepwell | Free | Worn iron | Slate, copper, jade |
| B | Ironworks | 450 CR | Tempered steel | Copper, jade, iron, silver |
| C | Gilded Fault | 1,800 CR | Jade-forged | Iron, silver, gold, diamond |
| D | Ember Hollow | 6,000 CR | Foundry alloy | Silver, gold, diamond, emberstone |

Permits unlock sequentially, spend credits once, and persist independently of the current mine. Unlocking does not teleport the player; Travel is explicit. Previous mines remain accessible. Mine travel regenerates the destination field and safely returns the player to its gate. The four mines now have different footprints, structures, lighting and gate positions; see ENVIRONMENTS_AND_CONTACT.md.

Tools: worn iron 1×; tempered steel 1.65× / 90 CR; jade-forged 2.6× / 340 CR; foundry alloy 4.2× / 950 CR / Rank B; gilded cutter 6.8× / 2,600 CR / Rank C; ember drillpick 10.5× / 7,200 CR / Rank D. Tools forge sequentially. Satchels have ten expansion levels, adding 30 slots each, with increasing costs. Exact tuning is in rules.js.

Common resources yield bigger bundles: slate 6, copper 4, jade 3, iron 3, silver 2, gold 2, diamond 1, emberstone 1. Each fragment retains its individual sell value. A full bundle must fit available slots including in-flight fragments before the block breaks, preventing overflow or discarded drops. The HUD identifies the bundle size and individual fragment value. Recovery notices aggregate fragments arriving together. Blocks-mined increments once per broken block, not once per fragment.

The Exchange has separate permit, forge and cargo sections; selling stays available across all sections. Disabled purchases state missing credits or rank/tool requirements. Permit actions sit above the directory so the next goal is visible without scrolling past every locked mine. HUD shows current rank, next permit savings, tool power, bag capacity and haul value. M opens permits, I opens cargo, E opens the exchange. Escape pauses. Tab is trapped within open dialogs. Hidden HUD content is excluded from screen-reader navigation.

Save schema 2 adds rank, active mine and eight resource slots. Schema 1 migrates in place preserving credits, gear, bag levels, old ore and mined count. The existing storage key is retained. Pending drops are included in snapshots. The economy is local and player-editable; online competitive trust remains future scope. Balance is initial tuning and needs extended human playtesting.
