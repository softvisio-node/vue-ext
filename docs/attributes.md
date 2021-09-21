# Attributes

Boolean attributes, recognized by `VueJS` (@vue/shared/isBooleanAttr):

```text
allowfullscreen, async, autofocus, autoplay, checked, controls, default, defer, disabled, formnovalidate, hidden, ismap, itemscope, loop, multiple, muted, nomodule, novalidate, open, readonly, required, reversed, scoped, seamless, selected
```

## Boolean static

Need to use expression:

```javascript
:hidden="true"
:hidden="false"
```

## Boolean dynamic

When updating bound attribute `vue` at first tries to set element property (if exists, checked with the `in` operator), if property is not exists it will update attribute.

-   When updating attribute, `vue` stringifies the value. For `boolean` attributes, if value is truthy or `""` - attribute will be set with the `""` value, otherwise attribute will be removed.
-   When updating property `vue` will set the value as is, without any coercion.
