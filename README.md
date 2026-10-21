# Voxel

A single-player voxel prison game: mine ore, grow timber, forge equipment, hunt monsters and complete generated dungeons. Return to your cell to rest and review each shift.

## Run locally

Requires Node.js 22+ for checks/builds and Python 3 for the local server. No packages need installing.

```sh
npm run dev
```

Open http://127.0.0.1:4317. On macOS, `Play Voxel.command` is also available.

## Verify and build

```sh
npm run check
npm run build
```

The build recreates `dist/` from an explicit runtime allowlist, checks local asset/import references and writes a SHA-256 release manifest. Tests, documentation, source-control metadata, hosting credentials and old archives are excluded. Three.js is bundled locally; its MIT notice is retained in `vendor/LICENSE-three.txt`.

## GitHub Pages

Push this project as a repository root with a `main` branch. Select **GitHub Actions** in Settings → Pages. The included workflow checks the game and deploys only `dist/`, following the official [static Pages workflow](https://github.com/actions/starter-workflows/blob/main/pages/static.yml).

The release includes a CNAME for `voxel.leolune.fun`. Set the Pages custom domain and its DNS records in your own GitHub/domain account before expecting that hostname to work. Repository subpaths are supported because runtime URLs remain relative. No deployment or DNS change has been performed by this preparation.

## Controls

WASD: move · Shift: sprint · Space: jump · mouse: look. If pointer lock is unavailable, drag RMB to look; dungeon fallback uses free mouse look and reserves RMB for guard.

Hold LMB: mine, chop or strike · bow: hold to draw, release to fire · Q: sword/bow in combat · RMB: dungeon buckler · E: interact/Exchange/bed/exit seal · F: dungeon difficulty at its entrance · Tab: skills/pause · R: return to yard (forfeits risky combat loot) · L: last shift report in your cell.

## Saves and limitations

Progress stays in this browser using localStorage. Reload discards risky monster loot. Work inventory, equipment, XP, credits, shift time, stamina and last shift report persist. Sleep restores health/stamina without paying report totals again. Saves on localhost do not automatically transfer to a different domain.

No server, account, multiplayer or analytics. Keyboard/mouse desktop play is the supported experience; mobile controls are not implemented. Automated checks do not replace human playtesting of audio, combat feel and long-session performance.

## Project map

`src/game/`: gameplay rules/world · `src/engine/`: input/rendering/audio · `src/ui/`: interface · `tests/`: gameplay and save regressions · `scripts/`: verification/release tools · `docs/BUILD_HISTORY.md`: retained development notes.
