---
appliesTo: "solution/CanvasApps/**"
---

# Canvas App YAML Editing Rules

When editing Canvas app YAML files:

## Control Naming Convention
All controls must use prefixed names:
- Screens: `scr_Name`
- Buttons: `btn_Name`
- Galleries: `gal_Name`
- Labels: `lbl_Name`
- Text Inputs: `txt_Name`
- Forms: `frm_Name`
- Icons: `ico_Name`
- Containers: `con_Name`
- Images: `img_Name`

## Layout Rules
- Use responsive containers (Horizontal, Vertical) — never absolute X/Y positioning
- Set `LayoutMode: Auto` on containers
- Use `Fill` and `AlignInContainer` properties for responsive behavior
- Test at different screen sizes (phone, tablet, desktop)

## Accessibility
- Every interactive control needs `AccessibleLabel`
- Use `TabIndex` for keyboard navigation order
- Provide `Tooltip` on icon-only buttons
- Ensure sufficient color contrast

## Data Patterns
- Use `Concurrent()` for parallel data loading
- Set `LoadingSpinner: Controls.LoadingSpinner.Data` on galleries
- Handle empty states: `If(IsEmpty(Gallery.AllItems), "No items found")`
- Use `Patch()` for creates/updates, `Remove()` for deletes

## Performance
- Minimize `OnStart` logic — use `OnVisible` per screen
- Use delegation-friendly functions (Filter, Sort, Search, FirstN)
- Avoid `Collect()` for large datasets — query Dataverse directly
- Cache user profile: `Set(varCurrentUser, Office365Users.MyProfile())`
