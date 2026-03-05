---
appliesTo: "pbip/**"
---

# Power BI PBIP Editing Rules

When editing Power BI files in PBIP format:

## Semantic Model (TMDL)
- Files in `*.SemanticModel/` define the data model
- `model.tmdl` — top-level model config
- `tables/*.tmdl` — table definitions with columns and measures
- `relationships.tmdl` — relationships between tables
- `expressions/*.tmdl` — Power Query parameters

## TMDL Syntax
```tmdl
table MyTable
    lineageTag: <unique-guid>

    column MyColumn
        dataType: string
        sourceColumn: logical_column_name
        lineageTag: <unique-guid>
        summarizeBy: none

    measure 'My Measure'
        = COUNTROWS(MyTable)
        formatString: #,##0
        lineageTag: <unique-guid>
```

## Rules
- Every object needs a unique `lineageTag` (GUID)
- Use DirectQuery mode for Dataverse connections
- Use `CommonDataService.Database()` for the partition source
- Create measures (not calculated columns) unless sort keys are needed
- Use DAX variables for readability
- Set appropriate `formatString` for every measure
- Never embed secrets or connection strings in TMDL files
- Use expressions folder for parameterized connection strings

## Report JSON
- Visual positions use x, y, width, height
- Reference measures by table and measure name
- Use bookmarks for interactive experiences
- Keep filter configurations in report-level filters when possible

## DirectQuery + Dataverse Note
`CommonDataService.Database()` in DirectQuery mode does NOT support M parameter references — use literal strings for the org URL in the partition source.
