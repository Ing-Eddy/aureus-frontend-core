# Auditoría de la familia de formularios

Revisión de los 20 componentes públicos (10 fields y 10 controls) y de los recursos compartidos de `src/internal`, según el método D7 de `design.md`.

**Evidencia reunida:**
- búsqueda de textos literales (atributos accesibles, texto JSX y valores por defecto en props de texto) y de `fieldStrings`;
- conversiones de tipo inseguras (`as unknown as`, `as never`);
- regla de carpetas;
- formato de los avisos y errores;
- matriz de stories por familia;
- docs `api` comparada con las props exportadas, y JSDoc;
- transiciones sin `motion-reduce`;
- la última ejecución completa en Chromium con axe: 805 stories en verde, sin violaciones.

**Severidad:**
- **Alta:** defecto de accesibilidad, texto por defecto o comportamiento roto.
- **Media:** incoherencia que el consumidor nota.
- **Baja:** orden interno.

**Estado:** revisado el 2026-11-15 y corregido (ver "Estado final"). Decisiones:
- **Aceptados:** todos los hallazgos, salvo los tres siguientes. SE2 se resuelve con T7.
- **Pospuesto:** T9. El aviso nombra el componente que recibe la prop.
- **Se mantienen sin cambios de código:** T12, donde solo se añade un comentario en los casts que no lo tengan, y TX2.

Los cambios de comportamiento T6, T7 y T8 se añaden al delta de la spec como el requisito "Consistent development warnings across the family".

Informe publicado: https://claude.ai/artifact/6KaL8ChuCaG8zzHQ3sEZqu

## Resumen

| Área | Alta | Media | Baja |
|---|---|---|---|
| Textos por defecto | 7 | — | — |
| Accesibilidad | — | — | 1 |
| Coherencia de API y avisos | — | 3 | 2 |
| Responsive / RTL | 1 | 1 | — |
| Tests | — | 2 | — |
| Docs / Storybook | — | 5 | 1 |
| Código (duplicación, tipos) | — | 2 | 1 |
| **Total** | **8** | **13** | **5** |

**Sin incidencias:** no hay textos literales en atributos accesibles, en texto JSX ni en valores por defecto con literales (todos llegan a través de `fieldStrings`). La regla de carpetas se cumple en los 20 componentes. axe no da violaciones. Los únicos `throw` son mensajes de desarrollo (`<Component> must be rendered inside a react-hook-form FormProvider.`), que están permitidos.

## Hallazgos transversales

| # | Área | Sev. | Hallazgo | Ubicación | Corrección propuesta |
|---|---|---|---|---|---|
| T1 | Textos | Alta | Texto por defecto "Loading" en el spinner de todas las familias | `internal/components/field-loading/field-loading.tsx:12` | Fase 2: `loadingLabel` obligatorio con `loading` (D1, D3) |
| T2 | Textos | Alta | Texto por defecto "More information" en el botón de info de todas las familias | `internal/components/field-info/field-info.tsx:23` | Fase 2: `infoLabel` obligatorio con `info` |
| T3 | Textos | Alta | "Increase"/"Decrease" por defecto en el stepper | `internal/components/field-stepper/field-stepper.tsx:70-71, 115-116` | Fase 2: labels obligatorios salvo con `stepper={false}` |
| T4 | Código | Media | `DistributiveOmit` está definido 3 veces | `select-field/types/select-field-types.ts:175`, `select-control/select-control-types.ts:5`, `checkbox-field/checkbox-field-types.ts:81` | Una sola definición en `internal/types` (D1) |
| T5 | Tests | Media | El serializador de paridad (`canonical` y la normalización de ids) está copiado 10 veces | `*-control/tests/*-parity-tests.tsx` | `src/internal/testing/parity.ts` (D6) |
| T6 | Avisos | Media | Text, Password, Text area, Number y Select no avisan cuando el campo no tiene nombre accesible; las otras 5 familias sí | `components/{text,password,text-area,number,select}-field` | Aviso "has no accessible name" en todos, mediante `useMissingTexts` (D4) |
| T7 | Avisos | Media | El aviso de valor desconocido usa dos textos distintos: Select dice `value "x" is not among the options. It is kept as is.` y los grupos dicen `the value "x" matches no option; it is kept.` | `select-field/hooks/use-select-options.ts:101` | Unificar en `<Component>: the value "x" matches no option; it is kept.` |
| T8 | Avisos | Baja | `FieldAction` avisa con el prefijo "Field action:" en vez del nombre del componente | `internal/components/field-action/field-action.tsx:26` | Aceptar un `componentName` opcional; si falta, mantener el prefijo genérico |
| T9 | Avisos | Baja | Dentro de un control, los avisos llevan el nombre del field (un `SelectControl` avisa como "SelectField:") | Todos los `*-control` | Se pospone: el aviso nombra el componente que de verdad recibe la prop, y está documentado |
| T10 | Responsive | Media | Solo Switch y OTP tienen story `Rtl`; falta en las otras 8 familias de fields | `apps/storybook/.../forms/*-field` | Story `Rtl` con comprobación calculada en todas (D8) |
| T11 | A11y | Baja | Transiciones sin `motion-reduce`: segmento del radio, chevron del select, casilla OTP, botón de info, tarjeta de elección y stepper | `radio-segmented.tsx:11`, `select-field/components/styles.ts:17`, `otp-slots.tsx:11`, `field-info.tsx:37`, `choice-styles.ts:29`, `field-styles.ts:46` | Añadir `motion-reduce:transition-none` |
| T12 | Código | Baja | `as never` en las props de Base UI (`multiple`, `value`, `itemToStringLabel`) y `as unknown as` en los controles con sobrecargas | `select-roots.tsx:161-236`, `checkbox-control.tsx:51`, `switch-control.tsx:47` | Se mantienen: son límites de genéricos de librerías externas o de sobrecargas. Se documentan con un comentario donde falte |
| T13 | Docs | Media | `id` y `onBlur` no aparecen en la tabla `api` de varias familias, pero sí son props | Docs de checkbox, checkbox group, OTP, radio group, select y switch | Listarlos siempre en `api` (EN/ES) |
| T14 | Tests | Media | Faltan tests de tipos en Text, Password, Text area y Number | `components/{text,password,text-area,number}-field/tests` | Se añaden con la fase 2 (un `@ts-expect-error` por cada texto exigido) |

## Por componente

### Text field / Text control
| # | Área | Sev. | Hallazgo | Corrección |
|---|---|---|---|---|
| TX1 | Storybook | Media | No tiene story `Keyboard` | Añadirla: Tab, Enter con la acción y Escape |
| TX2 | Storybook | Baja | `CustomLabelStyles` es la única story de estilos de toda la familia | Mantenerla; se valora llevar el patrón a la guía |

### Password field / Password control
| # | Área | Sev. | Hallazgo | Corrección |
|---|---|---|---|---|
| PW1 | Textos | Alta | "Show password"/"Hide password" por defecto | `password-field.tsx:18-19`: obligatorios siempre (D2) |
| PW2 | Storybook | Media | No tiene story `Keyboard` | Añadirla: Tab hasta el toggle, Espacio, el foco se mantiene |
| PW3 | Storybook | Media | `PasswordControl` no tiene story `DisabledVsLoading`, a diferencia de los otros 9 controles | Añadirla |

### Text area field / Text area control
| # | Área | Sev. | Hallazgo | Corrección |
|---|---|---|---|---|
| TA1 | Textos | Alta | El contador trae los textos por defecto "N characters remaining" y "N characters" | `text-area-field.tsx:66-67`: `countLabel(count, maxLength?)` obligatorio con `showCount` (D2) |
| TA2 | Storybook | Media | No tiene story `Keyboard` | Añadirla: el atajo de la acción (Ctrl/Cmd+Enter) y que Enter haga salto de línea |

### Number field / Number control
| # | Área | Sev. | Hallazgo | Corrección |
|---|---|---|---|---|
| NU1 | Textos | Alta | "minus" en `aria-valuetext` | `number-field.tsx:52`: se elimina `minusLabel`; se usa el formato con signo de `Intl` |
| NU2 | Textos | Alta | "Invalid expression" y "Calculated from …" por defecto | `number-field.tsx:50-51`: obligatorios con `expressions` |

### Select field / Select control
| # | Área | Sev. | Hallazgo | Corrección |
|---|---|---|---|---|
| SE1 | Código | Media | 24 miembros de las uniones de tipos no tienen JSDoc (`multiple`, `multipleDisplay`, `filter`, `creatable`, `createLabel`, `maxSelected`…) | `select-field/types/select-field-types.ts`: JSDoc en cada rama |
| SE2 | Avisos | Media | Ver T7 | — |

### Radio group field / Radio group control
| # | Área | Sev. | Hallazgo | Corrección |
|---|---|---|---|---|
| RG1 | RTL / A11y | Alta | Encontrado durante la fase 5 al añadir la story `Rtl`: el `RadioGroup` de Radix pone `dir="ltr"` en su raíz cuando no hay `DirectionProvider`, así que en una página RTL los radios quedan a la izquierda y las flechas de un grupo horizontal van al revés | `radio-group-field.tsx`: `useInheritedDirection` (`internal/hooks`) pasa la dirección heredada como `dir`. La story `Rtl` comprueba la posición y ArrowLeft. Requisito "Right-to-left layout across the family" en la spec |

### Checkbox, Checkbox group, Switch, OTP
Sin hallazgos propios aparte de los transversales: T1, T2, T10 (`Rtl` en checkbox y checkbox group), T11 y T13.

## Fuera de alcance (observado)
- La story `Empty` del `combobox` de shadcn falló una vez de forma intermitente en una ejecución completa y pasa sola. No es un componente de esta familia; queda anotado para revisar aparte.
- **G1 (media):** visto en las capturas de la 7.2. El MDX de Storybook no tiene GFM (`remark-gfm`), así que todas las tablas markdown de las guías (familias, props comunes, textos exigidos) se muestran como texto con barras. Ya pasaba antes de este cambio. Corregirlo exige añadir `remark-gfm` y configurarlo en `@storybook/addon-docs`, una decisión de dependencias que queda pendiente.

## Estado final

Todos los hallazgos aceptados están corregidos, salvo los dos que se decidió no tocar. Se verificó con `pnpm lint && pnpm typecheck && pnpm test && pnpm build && pnpm check:package`, con la suite completa dos veces seguidas.

| # | Estado | Cómo se verifica |
|---|---|---|
| T1, T2 | Corregido | `FieldLoadingTexts` y `FieldInfoTexts`; tests de tipos en los 10 fields; test de guardia |
| T3, NU1, NU2 | Corregido | `NumberStepperTexts`, `NumberExpressionTexts`; `minusLabel` eliminado; test y story del `aria-valuetext` "-$1,234.50" |
| PW1 | Corregido | `showPasswordLabel` y `hidePasswordLabel` obligatorios; tests de tipos y de avisos |
| TA1 | Corregido | `TextAreaCountTexts` con `countLabel(count, maxLength?)`; test del contador |
| T4 | Corregido | Un solo `DistributiveOmit` en `internal/types`, usado por los 10 controles |
| T5 | Corregido | `internal/testing/parity.tsx`, fuera del build; los 10 tests de paridad lo usan |
| T6 | Corregido | `useMissingTexts` e `inputNameCheck` en todos los fields; Select acepta `aria-label` y `aria-labelledby`; tests de avisos |
| T7, SE2 | Corregido | Una sola redacción `the value "x" matches no option; it is kept.` |
| T8 | Corregido | `FieldAction` recibe `componentName`; test del prefijo |
| T9 | Pospuesto | El aviso nombra el componente que recibe la prop; documentado |
| T10 | Corregido | Story `Rtl` con comprobación de layout calculado en las 10 familias |
| T11 | Corregido | `motion-reduce:transition-none` en las 7 transiciones |
| T12 | Se mantiene | Casts justificados; comentario añadido en `select-roots.tsx` |
| T13 | Corregido | `id`, `onBlur` y los textos obligatorios en la tabla `api` (EN/ES) |
| T14 | Corregido | Tests de tipos nuevos en Text, Password, Text area y Number |
| TX1, PW2, TA2 | Corregido | Stories `Keyboard` |
| TX2 | Se mantiene | Sin cambios |
| PW3 | Corregido | Story `DisabledVsLoading` en `PasswordControl` |
| SE1 | Corregido | JSDoc en cada rama de las uniones de Select |
| RG1 | Corregido | `useInheritedDirection`; story `Rtl` con posición y ArrowLeft |

**Capturas (build estática):** las 10 familias en claro, oscuro, táctil y RTL, y la guía en ES. Sin desbordes ni problemas de contraste. Dos detalles: la story `Rtl` de Select usaba un valor que no estaba entre las opciones (corregido, ahora comprueba que se muestra la etiqueta), y G1, fuera de alcance.

