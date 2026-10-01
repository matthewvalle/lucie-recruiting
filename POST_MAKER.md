# Instagram Post Maker

Live at **https://lucievalle.com/post-maker** (also linked as "Post Maker" in the dashboard header).
Makes a 1080×1350 (Instagram 4:5) schedule graphic plus a ready-to-paste caption.

## Making a post (about 2 minutes, works on a phone)

1. **Events**: edit, add or remove events. They sort by date automatically; up to 6 fit.
   Leave "End date" blank for one-day events; fill it in for multi-day ones (shows as `20–22`).
2. **Photo**: pick a saved photo or upload a new one, then use the Zoom / Left-right / Up-down sliders to frame it.
3. **Text**: change the title (e.g. `WINTER` / `SCHEDULE`, `SUMMER` / `CIRCUIT`), footer, and so on.
4. **Look**: Tomahawks purple/gold or Choate blue/gold, and turn either logo on or off.
5. Tap **Share / Save to Photos** on a phone (or **Download PNG** on a computer), then post it to Instagram.
6. Tap **Copy caption** and paste it into the Instagram caption.

Your edits are remembered in that browser. **Reset to defaults** goes back to the values in
`src/lib/post-maker/defaults.ts`.

## Changing the defaults / adding photos

- Default events, name, number, etc. are in `src/lib/post-maker/defaults.ts`.
- To add a photo to the picker, put the file in `public/post-maker/` and add it to `PRESET_PHOTOS`.
- **Choate logo:** save the seal as `public/post-maker/choate-seal.png` (a transparent PNG works best).
  Until then, use "Upload Choate logo" in the tool. It's remembered in that browser, and a "CRH"
  placeholder shows otherwise.

The drawing code is in `src/lib/post-maker/render.ts`; the page is `src/components/PostMaker.tsx`.
