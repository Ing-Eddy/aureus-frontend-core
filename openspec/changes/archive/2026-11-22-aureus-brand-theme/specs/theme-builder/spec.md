## MODIFIED Requirements

### Requirement: Default starting theme
When there is no saved draft, the builder SHALL start from the Aureus brand theme: the color tokens `@aureus-core/ui` ships, with Aureus Blue as primary, Aureus Gold as secondary and slate neutrals. Its inputs MUST describe that theme: the blue primary color, a non-achromatic primary, the slate neutral palette and primary-derived charts. Its preview MUST look like the components do elsewhere in the playground. A "Reset" action MUST bring the builder back to this state after asking for confirmation.

#### Scenario: First visit
- **WHEN** a user opens the builder for the first time
- **THEN** every token shows the value the package's stylesheet uses, and no contrast pair is flagged

#### Scenario: Reset
- **WHEN** a user has edited the theme and confirms "Reset"
- **THEN** every input and token returns to the Aureus brand theme, and the saved draft is discarded

#### Scenario: Brand inputs
- **WHEN** a user opens the builder for the first time
- **THEN** the primary color input shows Aureus Blue and the neutral palette shows slate
