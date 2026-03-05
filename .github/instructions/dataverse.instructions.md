---
appliesTo: "solution/Entities/**"
---

# Dataverse Schema Editing Rules

When editing files in the `solution/Entities/` directory:

## Naming
- Table logical names: `cat_tablename` (lowercase, no spaces, publisher prefix)
- Column logical names: `cat_columnname` (lowercase, publisher prefix)
- Display names: Title Case ("My Column Name")
- Schema names: PascalCase where required by platform

## Required Elements
- Every table needs: Entity.xml, at least one view, at least one form
- Every Entity.xml needs: LocalizedNames, Descriptions, primary name attribute
- Every attribute needs: PhysicalName, DisplayName, Description, RequiredLevel

## GUIDs
- Generate unique GUIDs for every new component
- Never reuse GUIDs from other entities
- Format: lowercase with hyphens (xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx)

## Attribute Types Reference
| Type | XML Element | Notes |
|------|------------|-------|
| Text | `StringAttributeMetadata` | Set MaxLength (default 100) |
| Number | `IntegerAttributeMetadata` | Set MinValue, MaxValue |
| Decimal | `DecimalAttributeMetadata` | Set Precision |
| Currency | `MoneyAttributeMetadata` | Links to transaction currency |
| DateTime | `DateTimeAttributeMetadata` | DateOnly or DateAndTime |
| Lookup | `LookupAttributeMetadata` | Requires relationship definition |
| Choice | `PicklistAttributeMetadata` | Define OptionSet values |
| Boolean | `BooleanAttributeMetadata` | TrueOption/FalseOption labels |
| Multiline | `MemoAttributeMetadata` | Set MaxLength (up to 1048576) |

## Cascade Rules for Relationships
- **Assign**: Cascade (child follows parent owner)
- **Delete**: RemoveLink (don't delete children)
- **Merge**: Cascade
- **Reparent**: Cascade
- **Share**: Cascade
