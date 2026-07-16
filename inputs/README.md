# inputs/ — private source material (not committed)

This directory holds **private source material** used to build Miami Roots context:
WhatsApp screenshots, chat exports, raw/alternate design files, and other reference
material that must never become part of the public repository history.

**Everything in this directory except this README is excluded from Git** via the
repository `.gitignore`:

```
# Private source material
inputs/*
!inputs/README.md
```

Do not weaken that rule. If a file from here needs to become a production asset, it must
be deliberately reviewed, approved, renamed canonically, and placed under `public/` in its
own commit — never committed from inside `inputs/`.

## Directory layout

```
inputs/
├── README.md                  ← the only tracked file in this tree
├── brand-assets/              ← raw/alternate/draft design files not approved for production
├── whatsapp-exports/          ← WhatsApp chat text exports (.txt/.zip)
└── screenshots/
    ├── group-bios/            ← screenshots of each WhatsApp group's name/bio/description
    │   ├── general-chat/
    │   ├── business-and-connections/
    │   ├── nightlife-and-event-marketing/
    │   ├── daytime-events/
    │   ├── community-organizing/
    │   ├── sober-social/
    │   ├── ticket-exchange/
    │   └── unidentified/      ← screenshots not yet matched to a group
    └── references/            ← other reference screenshots (admin screens, UI, drafts)
```

Because Git does not track empty directories and this tree is ignored, the layout above
will not survive a fresh clone — recreate it as needed when adding material. What was
received and reviewed is registered (without private content) in
[`docs/00-context/source-material-register.md`](../docs/00-context/source-material-register.md).

## Handling rules

- **Never commit** WhatsApp screenshots, chat exports, phone numbers, member names,
  private conversations, invite links, or personal contact information — here or anywhere
  else in the repository.
- Group **bios/descriptions** with no sensitive content may be transcribed (accurately or
  lightly normalized) into tracked docs; identifying details (phone numbers, invite links,
  member identities, admin identities) may not.
- If private material is ever found tracked by Git: keep the local file, remove it from
  tracking (`git rm --cached`), verify it is ignored, and flag it — do not silently
  continue, and treat any leaked invite link as compromised (rotate it).
